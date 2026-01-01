from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
  pass

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///comments.db'
db = SQLAlchemy(model_class=Base)
db.init_app(app)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40), nullable=False)
    comment = db.Column(db.Text, nullable=False)
    # When doing a query, display each row represented
    # by an object containing what's in the return statement
    def __repr__(self):
        return 'Comment ' + str(self.id)

with app.app_context():
    db.create_all()

@app.route('/comments', methods=['POST', 'GET'])
def comments():    
    if request.method == 'POST':
        db.session.add(Comment(
            name=request.form['name'],
            comment=request.form['comment']
        ))
        db.session.commit()
        return redirect('/comments')    
    # Get all the posts from the Database
    # This only happens if the method is GET (works like an "else")
    comments = Comment.query.all()    
    return render_template('comments.html', comments=comments)

if __name__ == '__main__':
    app.run(debug=True)