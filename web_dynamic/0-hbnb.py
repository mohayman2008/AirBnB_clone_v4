#!/usr/bin/python3
'''Script that starts a Flask web application'''
from uuid import uuid4

from flask import Flask, render_template

from models import storage, State, City, Amenity, Place

app = Flask(__name__)


@app.route('/0-hbnb/', strict_slashes=False)
def dynamic():
    '''Displays the AirBnB clone index page, with the data loaded from \
    the used storage engine used, for "/0-hbnb/" route'''
    data = {'states': storage.all(State).values(),
            'amenities': storage.all(Amenity).values(),
            'places': storage.all(Place).values(),
            'cache_id': uuid4()}
    return render_template('0-hbnb.html', **data)


@app.teardown_appcontext
def storage_close(exception):
    '''Teardown operations'''
    storage.close()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
