from flask import Flask, render_template, make_response, jsonify, request, session
from flask_restful import Api, Resource
from datetime import timedelta
import uuid
from db import DB

app = Flask(__name__)
app.permanent_session_lifetime = timedelta(minutes=30) # session will end after 30 minutes of inactivity (meaning no requests to server)
app.secret_key = uuid.uuid4().hex
app.session_cookie_name = 'my_session'
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
            if id_int == -1:
                if 'email' in session:
                    return jsonify({'success': True, 'fname': session.get('fname'), 'lname': session.get('lname'), 'birth_date': session.get('birth_date'), 'email': session.get('email')})
                else:
                    return jsonify({'error': 'User not logged in'})
            else:
                query_string = '''MATCH (n:User) WHERE ID(n) = %i RETURN n.fname AS fname, n.lname AS lname, n.birth_date AS birth_date''' % (id_int)

                db.connect()
                result = db.execute(query_string, with_response=True)
                db.close()
                
                if result['success'] and len(result['response']) == 1: 
                    return jsonify({'success': True, 'fname': result['response'][0]['fname'], 'lname': result['response'][0]['lname'], 'birth_date': result['response'][0]['birth_date']})
                else:
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
                return jsonify({'error': 'User already logged in'})
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
                return jsonify({'error': 'User not logged in'})
        else:
            return jsonify({'error': 'Bad request'})

class Users(Resource):
    def get(self, name):
        if 'email' in session:
            if name == '*':
                query_string = '''MATCH (n:User) WHERE n.email <> '%s' RETURN ID(n) as id, n.fname AS fname, n.lname AS lname''' % (session.get('email'))
            else:
                query_string = '''MATCH (n:User) WHERE n.email <> '%s' AND toLower(n.fname) + ' ' + toLower(n.lname) CONTAINS toLower('%s') RETURN ID(n) as id, n.fname AS fname, n.lname AS lname''' % (session.get('email'), name)
        else:
            if name == '*':
                query_string = '''MATCH (n:User) RETURN ID(n) as id, n.fname AS fname, n.lname AS lname'''
            else:
                query_string = '''MATCH (n:User) WHERE toLower(n.fname) + ' ' + toLower(n.lname) CONTAINS toLower('%s') RETURN ID(n) as id, n.fname AS fname, n.lname AS lname''' % (name)

        db.connect()
        result = db.execute(query_string, with_response=True)
        db.close()

        if result['success']:
            response = {'success': True}
            for user in result['response']:
                response[str(user['id'])] = {'fname': user['fname'], 'lname': user['lname']}
            return jsonify(response)
        else:
            return jsonify({'success': False})

class Friend(Resource):
    def get(self, id):
        if 'email' in session:
            query_string = '''MATCH (n:User), (m:User) WHERE n.email = '%s' AND ID(m) = %i RETURN EXISTS( (n)-[:IS_FRIEND]->(m) ) AS is_friend''' % (session.get('email'), id)

            db.connect()
            result = db.execute(query_string, with_response=True)
            db.close()

            if result['success'] and len(result['response']) == 1:
                return jsonify({'success': True, 'is_friend': result['response'][0]['is_friend']})
            else:
                return jsonify({'success': False})
        else:
            return jsonify({'error': 'User not logged in'})

    def post(self, id):
        if 'email' in session:
            query_string = '''MATCH (n:User), (m:User) WHERE n.email = '%s' AND ID(m) = %i MERGE (n)-[r:IS_FRIEND]->(m)''' % (session.get('email'), id)

            db.connect()
            result = db.execute(query_string)
            db.close()

            return jsonify({'success': result['success']})
        else:
            return jsonify({'error': 'User not logged in'})

    def delete(self, id):
        if 'email' in session:
            query_string = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE n.email = '%s' AND ID(m) = %i DELETE r''' % (session.get('email'), id)

            db.connect()
            result = db.execute(query_string)
            db.close()

            return jsonify({'success': result['success']})
        else:
            return jsonify({'error': 'User not logged in'})

class Friends(Resource):
    def get(self, type, id):
        try:
            id_int = int(id)
            if id_int == -1:
                if 'email' in session:
                    if type == 'count':
                        query_string = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE n.email = '%s' RETURN COUNT(r) AS count''' % (session.get('email'))

                        db.connect()
                        result = db.execute(query_string, with_response=True)
                        db.close()

                        if result['success'] and len(result['response']) == 1:
                            return jsonify({'success': True, 'friends_count': result['response'][0]['count']})
                        else:
                            return jsonify({'success': False})
                    elif type == 'profile':
                        query_string = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE n.email = '%s' RETURN ID(m) AS id, m.fname AS fname, m.lname AS lname''' % (session.get('email'))
                        
                        db.connect()
                        result = db.execute(query_string, with_response=True)
                        db.close()

                        if result['success']:
                            response = {'success': True}
                            for user in result['response']:
                                response[str(user['id'])] = {'fname': user['fname'], 'lname': user['lname']}
                            return jsonify(response)
                        else:
                            return jsonify({'success': False})
                    else:
                        return jsonify({'error': 'Bad request'})
                else:
                    return jsonify({'error': 'User not logged in'})
            else:
                if type == 'count':
                    query_string = '''MATCH (n:User)-[r:IS_FRIEND]->(m:User) WHERE ID(n) = %i RETURN COUNT(r) AS count''' % (id_int)

                    db.connect()
                    result = db.execute(query_string, with_response=True)
                    db.close()

                    if result['success'] and len(result['response']) == 1:
                        return jsonify({'success': True, 'friends_count': result['response'][0]['count']})
                    else:
                        return jsonify({'success': False})
                else:
                    return jsonify({'error': 'Bad request'})
        except Exception:
            return jsonify({'error': 'Bad request'})

class Login(Resource):
    def get(self): # returns info is user is logged in
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
            return jsonify({'error': 'User already logged in'})

class Logout(Resource):
    def get(self):
        session.clear()
        
api.add_resource(HomePage, '/')
api.add_resource(User, '/user/<string:id>')
api.add_resource(Users, '/users/<string:name>')
api.add_resource(Friend, '/friend/<int:id>')
api.add_resource(Friends, '/friends/<string:type>/<string:id>')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run()