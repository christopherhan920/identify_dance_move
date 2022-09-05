import json
from flask import Flask, request, jsonify

from tensorflow import keras
import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split

import cv2
import os
import pickle

# PARAMETERS
IMG_SIZE = 224
BATCH_SIZE = 64
EPOCHS = 50
MAX_SEQ_LENGTH = 20
NUM_FEATURES = 2048
model_path = 'model_1_09052022'

app = Flask(__name__)

@app.route('/', methods=['GET'])
def GET():
    # testing loading model
    model = keras.models.load_model(model_path)
    return 'loaded model: {}'.format(model_path)
    # return jsonify({'move_1': 'percentage_1', 'move_2': 'percentage_2', 'move_3': 'percentage_3', 'move_4': 'percentage_4'})

# Helper functions for the POST method

def crop_center_square(frame):
    y, x = frame.shape[0:2]
    min_dim = min(y, x)
    start_x = (x // 2) - (min_dim // 2)
    start_y = (y // 2) - (min_dim // 2)
    return frame[start_y : start_y + min_dim, start_x : start_x + min_dim]


def load_video(path: str, max_frames=0, resize=(IMG_SIZE, IMG_SIZE)):
    cap = cv2.VideoCapture(path)
    frames = []
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame = crop_center_square(frame)
            frame = cv2.resize(frame, resize)
            frame = frame[:, :, [2, 1, 0]]
            frames.append(frame)

            if len(frames) == max_frames:
                break
    finally:
        cap.release()
    return np.array(frames)

def preprocess_video(df, root_dir):
    num_samples = len(df)
    video_paths = df["video_name"].values.tolist()
    labels = df["tag"].values
    labels = label_processor(labels[..., None]).numpy()

    # `frame_masks` and `frame_features` are what we will feed to our sequence model.
    # `frame_masks` will contain a bunch of booleans denoting if a timestep is
    # masked with padding or not.
    frame_masks = np.zeros(shape=(num_samples, MAX_SEQ_LENGTH), dtype="bool")
    frame_features = np.zeros(
        shape=(num_samples, MAX_SEQ_LENGTH, NUM_FEATURES), dtype="float32"
    )

    # For each video.
    for idx, path in enumerate(video_paths):
        print('Working on video {}'.format(idx))
        # Gather all its frames and add a batch dimension.
        frames = load_video(os.path.join(root_dir, path))
        frames = frames[None, ...]

        # Initialize placeholders to store the masks and features of the current video.
        temp_frame_mask = np.zeros(shape=(1, MAX_SEQ_LENGTH,), dtype="bool")
        temp_frame_features = np.zeros(
            shape=(1, MAX_SEQ_LENGTH, NUM_FEATURES), dtype="float32"
        )

        # Extract features from the frames of the current video.
        for i, batch in enumerate(frames):
            video_length = batch.shape[0]
            length = min(MAX_SEQ_LENGTH, video_length)
            for j in range(length):
                temp_frame_features[i, j, :] = feature_extractor.predict(
                    batch[None, j, :]
                )
            temp_frame_mask[i, :length] = 1  # 1 = not masked, 0 = masked

        frame_features[idx,] = temp_frame_features.squeeze()
        frame_masks[idx,] = temp_frame_mask.squeeze()

    return (frame_features, frame_masks), labels

def load_model():
    model = keras.models.load_model(model_path)
    print('loaded model: {}'.format(model_path))
    return model

def predict(video: np.array) -> dict:
    # take the input video as np.array and return prediction
    print('predicting')


@app.route('/', methods=['POST'])
def POST():
    # convert video into byte array
    # decode it into video

    video_array = json.loads(request.data)


    # from the point the video is a numpy array

    return jsonify(video_array)

app.run(debug=True)