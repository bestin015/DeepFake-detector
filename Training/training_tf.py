from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2, preprocess_input
model=MobileNetV2(weights ='imagenet')
print(model.summary())