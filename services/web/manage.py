from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from project import create_app
from project.models import db

app = create_app()
manager = Manager(app)
migrate = Migrate(app, db)

@manager.command
def create_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

@manager.command
def runserver():
    app.run(debug=True, host="0.0.0.0", port=5000)

'''
@cli.command("seed_db")
def seed_db():
    u = User(email="michael@mherman.org")
    o = Order(price='123')
    db.session.add(u)
    db.session.commit()
    db.session.add(o)
    db.session.commit()
'''

if __name__ == "__main__":
    manager.run()