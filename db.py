from neo4j import GraphDatabase

class DB:
    def __init__(self, uri, user, password):
        self.uri = uri
        self.user = user
        self.password = password
        self.driver = None

    def connect(self):
        if not self.driver:
            self.driver = GraphDatabase.driver(self.uri, auth=(self.user, self.password))

    def execute(self, query, with_response=False):
        result = {}
        try:
            if self.driver:
                with self.driver.session() as session:
                    if with_response:
                        result['response'] = list(session.run(query))
                        result['success'] = True
                    else:
                        session.run(query)
                        result['success'] = True
        except Exception as e:
            print(e)
            result['success'] = False
        
        return result

    def close(self):
        if self.driver:
            self.driver.close()
            self.driver = None