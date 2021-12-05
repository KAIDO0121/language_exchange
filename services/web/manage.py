from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from project import create_app
from project.models import db

app = create_app()
manager = Manager(app)

@manager.command
def create_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

@manager.command
def runserver():
    app.run(debug=True, host="0.0.0.0", port=5000)


if __name__ == "__main__":
    manager.run()