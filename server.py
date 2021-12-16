from flask import Flask, render_template, make_response, jsonify, request, session
from flask_restful import Api, Resource
from datetime import timedelta
from db import DB

app = Flask(__name__)
app.permanent_session_lifetime = timedelta(minutes=30) # session will end after 30 minutes of inactivity (meaning no requests to server)
app.secret_key = 'f1ae76998e124a25b76f18e03fc17d2a'
api = Api(app)
db = DB('neo4j+s://f83801e6.databases.neo4j.io:7687', 'neo4j', 'cbXX3B5HHot982851CHDFQAWy3Nc2-BeJOeERSHrId4')

class HomePage(Resource):
    def get(self):
        response = make_response(render_template('index.html'))
        response.headers['content-type'] = 'text/html'
        return response

class User(Resource):
    def get(self, id): # get user's data
        try:
            id_int = int(id)
            if id_int == -1: # current user
                if 'email' in session:
                    query_string = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE n.email = '%s' RETURN COUNT(r) AS count''' % (session.get('email'))

                    db.connect()
                    result = db.execute(query_string, with_response=True)
                    db.close()

                    if result['success'] and len(result['response']) == 1:
                        return jsonify({'success': True, 'fname': session.get('fname'), 'lname': session.get('lname'), 'birth_date': session.get('birth_date'), 'email': session.get('email'), 'friends_count': result['response'][0]['count']})
                    else:
                        return jsonify({'success': False})
                else:
                    return jsonify({'not_logged_in': True})
            else:
                if 'email' in session:
                    query_string_1 = '''MATCH (n:User) WHERE ID(n) = %i RETURN n.fname AS fname, n.lname AS lname, n.birth_date AS birth_date''' % (id_int)
                    query_string_2 = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE ID(n) = %i RETURN COUNT(r) AS count''' % (id_int)
                    query_string_3 = '''MATCH (n:User), (m:User) WHERE n.email = '%s' AND ID(m) = %i RETURN EXISTS( (n)-[:IS_FRIEND]->(m) ) AS is_friend''' % (session.get('email'), id_int)

                    db.connect()
                    result_1 = db.execute(query_string_1, with_response=True)
                    result_2 = db.execute(query_string_2, with_response=True)
                    result_3 = db.execute(query_string_3, with_response=True)
                    db.close()

                    if result_1['success'] and result_2['success'] and result_3['success'] and len(result_1['response']) == 1 and len(result_2['response']) == 1 and len(result_3['response']) == 1:
                        return jsonify({'success': True, 'logged_in': True, 'is_friend': result_3['response'][0]['is_friend'], 'fname': result_1['response'][0]['fname'], 'lname': result_1['response'][0]['lname'], 'birth_date': result_1['response'][0]['birth_date'], 'friends_count': result_2['response'][0]['count']})
                    else:
                        return jsonify({'success': False})
                else:
                    query_string_1 = '''MATCH (n:User) WHERE ID(n) = %i RETURN n.fname AS fname, n.lname AS lname, n.birth_date AS birth_date''' % (id_int)
                    query_string_2 = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE ID(n) = %i RETURN COUNT(r) AS count''' % (id_int)

                    db.connect()
                    result_1 = db.execute(query_string_1, with_response=True)
                    result_2 = db.execute(query_string_2, with_response=True)
                    db.close()

                    if result_1['success'] and result_2['success'] and len(result_1['response']) == 1 and len(result_2['response']) == 1:
                        return jsonify({'success': True, 'fname': result_1['response'][0]['fname'], 'lname': result_1['response'][0]['lname'], 'birth_date': result_1['response'][0]['birth_date'], 'friends_count': result_2['response'][0]['count']})
                    return jsonify({'success': False})
        except Exception:
            return jsonify({'error': 'Bad request'})

    def post(self, id): # register user
        if id == '-1':
            if not 'email' in session:
                data = request.get_json()    
                query_string = '''CREATE (n:User {fname: '%s', lname: '%s', birth_date: '%s', email: '%s', password: '%s'})''' % (data['fname'], data['lname'], data['birth_date'], data['email'], data['password'])
            
                db.connect()
                result = db.execute(query_string)
                db.close()
                
                return jsonify({'success': result['success']})
            else:
                return jsonify({'logged_in': True})
        else:
            return jsonify({'error': 'Bad request'})

    def put(self, id): # edit user's data
        if id == '-1':
            if 'email' in session:
                data = request.get_json()
                if 'password' in data:
                    query_string = '''MATCH (n:User) WHERE n.email = '%s' SET n.fname = '%s', n.lname = '%s', n.birth_date = '%s', n.password = '%s' ''' % (session.get('email'), data['fname'], data['lname'], data['birth_date'], data['password'])
                else:
                    query_string = '''MATCH (n:User) WHERE n.email = '%s' SET n.fname = '%s', n.lname = '%s', n.birth_date = '%s' ''' % (session.get('email'), data['fname'], data['lname'], data['birth_date'])
            
                db.connect()
                result = db.execute(query_string)
                db.close()

                if result['success']:
                    session['fname'] = data['fname']
                    session['lname'] = data['lname']
                    session['birth_date'] = data['birth_date']
                    return jsonify({'success': True})
                return jsonify({'success': False})
            else:
                return jsonify({'not_logged_in': True})
        else:
            return jsonify({'error': 'Bad request'})

class Users(Resource):
    def get(self, name):
        if 'email' in session:
            if name == '*':
                query_string = '''MATCH (n:User) WHERE n.email <> '%s' RETURN ID(n) as id, n.fname AS fname, n.lname AS lname ORDER BY fname, lname''' % (session.get('email'))
            else:
                query_string = '''MATCH (n:User) WHERE n.email <> '%s' AND toLower(n.fname) + ' ' + toLower(n.lname) CONTAINS toLower('%s') RETURN ID(n) as id, n.fname AS fname, n.lname AS lname ORDER BY fname, lname''' % (session.get('email'), name)
        else:
            if name == '*':
                query_string = '''MATCH (n:User) RETURN ID(n) as id, n.fname AS fname, n.lname AS lname ORDER BY fname, lname'''
            else:
                query_string = '''MATCH (n:User) WHERE toLower(n.fname) + ' ' + toLower(n.lname) CONTAINS toLower('%s') RETURN ID(n) as id, n.fname AS fname, n.lname AS lname ORDER BY fname, lname''' % (name)

        db.connect()
        result = db.execute(query_string, with_response=True)
        db.close()

        if result['success']:
            if 'email' in session:
                response = {'success': True, 'logged_in': True}
            else:
                response = {'success': True}
            for user in result['response']:
                response[user['fname'] + user['lname'] + str(user['id'])] = {'id': user['id'], 'fname': user['fname'], 'lname': user['lname']}
            return jsonify(response)
        else:
            return jsonify({'success': False})

class Friend(Resource):
    def post(self, id):
        if 'email' in session:
            query_string = '''MATCH (n:User), (m:User) WHERE n.email = '%s' AND ID(m) = %i MERGE (n)-[r:IS_FRIEND]->(m)''' % (session.get('email'), id)

            db.connect()
            result = db.execute(query_string)
            db.close()

            return jsonify({'success': result['success']})
        else:
            return jsonify({'not_logged_in': True})

    def delete(self, id):
        if 'email' in session:
            query_string = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE n.email = '%s' AND ID(m) = %i DELETE r''' % (session.get('email'), id)

            db.connect()
            result = db.execute(query_string)
            db.close()

            return jsonify({'success': result['success']})
        else:
            return jsonify({'not_logged_in': True})

class Friends(Resource):
    def get(self, type):
        if 'email' in session:
            if type == 'profile':
                query_string = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE n.email = '%s' RETURN ID(m) AS id, m.fname AS fname, m.lname AS lname ORDER BY fname, lname''' % (session.get('email'))
                
                db.connect()
                result = db.execute(query_string, with_response=True)
                db.close()

                if result['success']:
                    response = {'success': True}
                    for user in result['response']:
                        response[user['fname'] + user['lname'] + str(user['id'])] = {'id': user['id'], 'fname': user['fname'], 'lname': user['lname']}
                    return jsonify(response)
                else:
                    return jsonify({'success': False})
            elif type == 'suggestions':
                suggestions_max = 25
                query_string = '''MATCH (n:User{email: '%s'})-[:IS_FRIEND*]->(m:User) WHERE m.email <> n.email AND NOT EXISTS( (n)-[:IS_FRIEND]->(m) ) RETURN DISTINCT m''' % (session.get('email'))

                db.connect()
                result_1 = db.execute(query_string, with_response=True)
                if result_1['success']:
                    if len(result_1['response']) < suggestions_max:
                        query_string = '''MATCH (n:User{email: '%s'}), (m:User) WHERE m.email <> n.email AND NOT EXISTS( (n)-[:IS_FRIEND*]->(m) ) RETURN DISTINCT m''' % (session.get('email'))
                        result_2 = db.execute(query_string, with_response=True)
                        db.close()

                        if result_2['success']:
                            response = {'success': True}
                            i = 0
                            for record in result_1['response']:
                                suggestions_max -= 1
                                node = record.values()[0]
                                id = node.id
                                fname = node.get('fname')
                                lname = node.get('lname')
                                response[str(i)] = {'id': id, 'fname': fname, 'lname': lname}
                                i += 1
                            for record in result_2['response']:
                                if suggestions_max <= 0:
                                    break
                                suggestions_max -= 1
                                node = record.values()[0]
                                id = node.id
                                fname = node.get('fname')
                                lname = node.get('lname')
                                response[str(i)] = {'id': id, 'fname': fname, 'lname': lname}
                                i += 1
                            return jsonify(response)
                        else:
                            return jsonify({'success': False})
                else:
                    db.close()
                    return jsonify({'success': False})
            else:
                return jsonify({'error': 'Bad request'})
        else:
            return jsonify({'not_logged_in': True})

class Login(Resource):
    def get(self): # returns info if user is logged in
        if 'email' in session:
            return jsonify({'logged_in': True})
        return jsonify({'logged_in': False})

    def post(self): # login user
        if not 'email' in session:
            data = request.get_json()
            query_string = '''MATCH (n:User) WHERE n.email = '%s' AND n.password = '%s' RETURN ID(n) AS id, n.fname AS fname, n.lname AS lname, n.birth_date AS birth_date''' % (data['email'], data['password'])

            db.connect()
            result = db.execute(query_string, with_response=True)
            db.close()
        
            if result['success'] and len(result['response']) == 1:
                session['email'] = data['email']
                session['id'] = result['response'][0]['id']
                session['fname'] = result['response'][0]['fname']
                session['lname'] = result['response'][0]['lname']
                session['birth_date'] = result['response'][0]['birth_date']
                session.permanent = True
                return jsonify({'success': True})
            else:
                return jsonify({'success': False})
        else:
            return jsonify({'logged_in': True})

class Logout(Resource):
    def get(self):
        session.clear()
        
api.add_resource(HomePage, '/')
api.add_resource(User, '/user/<string:id>')
api.add_resource(Users, '/users/<string:name>')
api.add_resource(Friend, '/friend/<int:id>')
api.add_resource(Friends, '/friends/<string:type>')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')


if __name__ == '__main__':
    app.run(debug=True)