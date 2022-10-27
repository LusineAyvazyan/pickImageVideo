import { useNavigation } from '@react-navigation/core';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { auth } from '../config/firebase';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';

const HomeScreen = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const video = useRef(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  const { width: windowWidth } = useWindowDimensions();

  const navigation = useNavigation();

  const pickImgVideo = async () => {
    setLoading(true);
    setImages([]);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      selectionLimit: 0,
      aspect: [4, 3],
      quality: 1,
    });
    setLoading(false);
    if (!result.cancelled) {
      setImages(result.uri ? [result.uri] : result.selected);
    }
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View>
          <Text style={styles.indicator}>Loading...</Text>
          <ActivityIndicator size={'large'} />
        </View>
      )}
      {images && (
        <View style={styles.scrollContainer}>
          <ScrollView
            horizontal={true}
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={1}
          >
            {images.map((image, imageIndex) => {
              return (
                <View
                  style={{ width: windowWidth, height: 250 }}
                  key={imageIndex}
                >
                  {image.type === 'image' ? (
                    <ImageBackground
                      source={{ uri: image.uri }}
                      style={styles.card}
                    />
                  ) : (
                    <Video
                      ref={video}
                      style={styles.video}
                      source={{ uri: image.uri }}
                      useNativeControls
                      resizeMode="contain"
                      isLooping={false}
                    />
                  )}
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.indicatorContainer}>
            {images.map((image, imageIndex) => {
              const width = scrollX.interpolate({
                inputRange: [
                  windowWidth * (imageIndex - 1),
                  windowWidth * imageIndex,
                  windowWidth * (imageIndex + 1),
                ],
                outputRange: [8, 16, 8],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={imageIndex}
                  style={[styles.normalDot, { width }]}
                />
              );
            })}
          </View>
        </View>
      )}
      <TouchableOpacity onPress={pickImgVideo} style={styles.button}>
        <Text style={styles.buttonText}>
          Browse an images or videos from gallery
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSignOut} style={styles.button}>
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0B1B32',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFB300',
    fontWeight: '700',
    fontSize: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#0B1B32',
    marginHorizontal: 4,
    marginBottom: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  buttonOutlineText: {
    color: '#0B1B32',
    fontWeight: '700',
    fontSize: 16,
  },
});
