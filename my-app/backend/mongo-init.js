db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('blogs');
db.blogs.insert({ title: 'Default Blog', author: 'Default Author', url: 'https://defaultblog.com', likes: 0 });
