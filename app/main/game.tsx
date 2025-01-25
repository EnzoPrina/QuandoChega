import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView, TapGestureHandler } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import background from '../../assets/images/2d/BG-13.png';
import autocarro from '../../assets/images/2d/autocarro.png';
import tree from '../../assets/images/2d/1.png';
import person from '../../assets/images/2d/2.png';
import cone from '../../assets/images/2d/12.png';
import gameover from '../../assets/images/2d/gameover-14.png';

const { width, height } = Dimensions.get('window');
const BUS_WIDTH = 120;
const BUS_HEIGHT = 80;
const FLOOR_HEIGHT = height - 160;

const GameScreen = () => {
  const [obstacles, setObstacles] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(10);
  const [highScore, setHighScore] = useState(0);

  const busPosition = useRef(new Animated.Value(0)).current;
  const backgroundPosition = useRef(new Animated.Value(0)).current;
  const jumpCount = useRef(0);
  const router = useRouter();

  const obstacleImages = [tree, person, cone];

  useEffect(() => {
    const fetchHighScore = async () => {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      if (storedHighScore) setHighScore(parseInt(storedHighScore, 10));
    };
    fetchHighScore();
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (isGameOver) return;

      setScore((prev) => prev + 1);
      if (score > 0 && score % 100 === 0) setSpeed((prev) => prev + 1);
    }, 30);

    return () => clearInterval(gameLoop);
  }, [isGameOver, score]);

  useEffect(() => {
    if (isGameOver) return;

    const spawnObstacle = () => {
      const randomObstacle = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
      const randomSize = Math.random() * 50 + 30; 
      const randomSpeed = Math.random() * 3 + speed;

      setObstacles((prev) => [
        ...prev,
        {
          x: width,
          id: Date.now(),
          src: randomObstacle,
          width: randomSize,
          height: randomSize,
          speed: randomSpeed,
        },
      ]);
    };

    const interval = setInterval(spawnObstacle, 2000);
    return () => clearInterval(interval);
  }, [isGameOver, speed]);

  useEffect(() => {
    const animateBackground = () => {
      backgroundPosition.setValue(0);
      Animated.loop(
        Animated.timing(backgroundPosition, {
          toValue: -width,
          duration: 40000,
          useNativeDriver: false,
        })
      ).start();
    };

    animateBackground();
  }, [isGameOver]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (isGameOver) return;

      setObstacles((prev) =>
        prev
          .map((obstacle) => ({ ...obstacle, x: obstacle.x - obstacle.speed }))
          .filter((obstacle) => obstacle.x + obstacle.width > 0)
      );
    }, 30);

    return () => clearInterval(gameLoop);
  }, [isGameOver]);

  useEffect(() => {
    const busY = FLOOR_HEIGHT - BUS_HEIGHT - busPosition.__getValue();

    obstacles.forEach((obstacle) => {
      const isCollidingX = 20 < obstacle.x + obstacle.width - 10 && 20 + BUS_WIDTH - 10 > obstacle.x;
      const isCollidingY =
        busY + BUS_HEIGHT - 10 > FLOOR_HEIGHT - obstacle.height && busY + 10 < FLOOR_HEIGHT;

      if (isCollidingX && isCollidingY) setIsGameOver(true);
    });
  }, [obstacles]);

  const handleJump = () => {
    if (!isGameOver && jumpCount.current < 2) {
      jumpCount.current += 1;
      Animated.timing(busPosition, {
        toValue: 250,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        Animated.timing(busPosition, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }).start(() => {
          jumpCount.current -= 1;
        });
      });
    }
  };

  const handleRestart = async () => {
    if (score > highScore) {
      setHighScore(score);
      await AsyncStorage.setItem('highScore', score.toString());
    }

    setIsGameOver(false);
    setObstacles([]);
    setScore(0);
    setSpeed(10);
    busPosition.setValue(0);
    backgroundPosition.setValue(0);
  };

  const resetHighScore = async () => {
    setHighScore(0);
    await AsyncStorage.setItem('highScore', '0');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TapGestureHandler onActivated={handleJump}>
        <View style={styles.container}>
          <Animated.Image
            source={background}
            style={[styles.background, { transform: [{ translateX: backgroundPosition }] }]}
          />
          <Animated.Image
            source={background}
            style={[styles.background, { left: width, transform: [{ translateX: backgroundPosition }] }]}
          />
          <Animated.Image
            source={autocarro}
            style={[styles.bus, { top: FLOOR_HEIGHT - BUS_HEIGHT - busPosition.__getValue() }]}
          />
          {obstacles.map((obstacle) => (
            <Image
              key={obstacle.id}
              source={obstacle.src}
              style={{
                ...styles.obstacle,
                left: obstacle.x,
                top: FLOOR_HEIGHT - obstacle.height,
                width: obstacle.width,
                height: obstacle.height,
              }}
            />
          ))}
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.highScore}>High Score: {highScore}</Text>
          {isGameOver && (
            <View style={styles.gameOverContainer}>
              <Image source={gameover} style={styles.gameOverImage} />
              <Text style={styles.finalScore}>Final Score: {score}</Text>
              <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleRestart}>
                <Text style={styles.buttonText}>Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#5cb32b' }]}
                onPress={() => router.push('/')}
              >
                <Text style={styles.buttonText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#f2a654' }]}
                onPress={resetHighScore}
              >
                <Text style={styles.buttonText}>Reset High Score</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TapGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#87CEEB' },
  background: { position: 'absolute', height, width, resizeMode: 'stretch' },
  bus: { position: 'absolute', width: BUS_WIDTH, height: BUS_HEIGHT, resizeMode: 'contain', left: 20 },
  obstacle: { position: 'absolute', resizeMode: 'contain' },
  score: { position: 'absolute', top: 40, left: 20, fontSize: 24, color: 'white' },
  highScore: { position: 'absolute', top: 80, left: 20, fontSize: 20, color: 'yellow' },
  gameOverContainer: { position: 'absolute', top: '20%', left: '20%', right: '20%', alignItems: 'center' },
  gameOverImage: { width: 200, height: 200, resizeMode: 'contain' },
  finalScore: { fontSize: 20, color: 'white', marginTop: 20 },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginTop: 10, alignItems: 'center', width: '100%' },
  buttonText: { fontSize: 18, color: 'white' },
});

export default GameScreen;
