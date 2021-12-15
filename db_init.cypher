// Unique email for each user constraint
CREATE CONSTRAINT ON (n:User) ASSERT n.email IS UNIQUE
