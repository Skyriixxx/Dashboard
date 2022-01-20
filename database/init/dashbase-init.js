db.createUser(
{
    user: "hazbin",
    pwd: ".",
    roles: [
        {
            role: "readWrite",
            db: "dashbase"
        }
    ]
});
db.createCollection('users');
db.createCollection('widgets');