from flask import Flask, request, make_response, render_template
from keras import backend as K
import numpy as np
import matplotlib.pyplot as plt

app = Flask(__name__)
from keras.models import model_from_json
import json

model_file = open('model.json', 'r')
model_io = model_file.read()
model_file.close()


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    model = model_from_json(model_io)
    model.load_weights('weights.h5')
    array = json.loads(request.data)['array']
    np_array = np.array(array)
    new_array = []
    for i in range(0, 280, 10):
        for j in range(0, 280, 10):
            new_array.append(int(np.average(np_array[i:i + 10, j:j + 10])))
    pixels = np.array(new_array).flatten().reshape((1, 28, 28, 1))
    respond = model.predict(pixels)[0]
    K.clear_session()
    print(respond)
    print(np.argmax(respond))
    predict_num = np.argmax(respond)
    confidence = max(respond)
    json_respond = json.dumps({"digit": "{}".format(predict_num), "confidence": "{}".format(confidence)})
    return json_respond


if __name__ == '__main__':
    app.run(host="0.0.0.0", debug=True)
