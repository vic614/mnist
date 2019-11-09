from flask import Flask, request, make_response, render_template
from keras import backend as K
import numpy as np

app = Flask(__name__)
from keras.models import model_from_json
import json

with open('./flaskr/model_fixtures/model.json', 'r') as f:
    model_io = f.read()

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    model = model_from_json(model_io)
    model.load_weights('./model_fixtures/weights.h5')
    # array_raw is 280 * 280 array
    array_raw = json.loads(request.data)['array']
    raw_array_np = np.array(array_raw)
    # array_processed is 28 * 28 array
    array_processed = []
    for i in range(0, 280, 10):
        for j in range(0, 280, 10):
            array_processed.append(int(np.average(raw_array_np[i:i + 10, j:j + 10])))
    pixels = np.array(array_processed).flatten().reshape((1, 28, 28, 1))
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
