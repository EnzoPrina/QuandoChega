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

import background from '../../assets/images/2d/background3.png';
import autocarro from '../../assets/images/2d/autocarro.png';
import pipeTop from '../../assets/images/2d/pipe3.png';
import pipeBottom from '../../assets/images/2d/pipe2.png';
import gameover from '../../assets/images/2d/gameover-14.png';

const { width, height } = Dimensions.get('window');
const BUS_SIZE = 40;
const JUMP_HEIGHT = 8; // Altura de ascenso continuo
const PIPE_WIDTH = 80;
const PIPE_GAP = 190; // Espacio entre las dos tuberías
const PIPE_MIN_Y = 120; // Altura mínima del hueco (distancia desde la parte superior)
const PIPE_MAX_Y = height - PIPE_GAP - 120; // Altura máxima del hueco (distancia desde la parte inferior)
const GRAVITY = 4; // Velocidad de caída por frame

const FlappyGame = () => {
  const [pipes, setPipes] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const router = useRouter();

  const busPosition = useRef(new Animated.Value(height / 2)).current;
  const gravityInterval = useRef(null);
  const jumpInterval = useRef(null);   

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

      // Mover los tubos hacia la izquierda
      setPipes((prev) => {
        const updated = prev.map((pipe) => ({ ...pipe, x: pipe.x - 5 }));
        return updated.filter((pipe) => pipe.x + PIPE_WIDTH > 0); // Eliminar tubos fuera de la pantalla
      });

      // Generar nuevos tubos
      if (pipes.length === 0 || pipes[pipes.length - 1].x < width - 350) {
        const gapStart = Math.random() * (PIPE_MAX_Y - PIPE_MIN_Y) + PIPE_MIN_Y; // Posición del hueco
        setPipes((prev) => [
          ...prev,
          { x: width, gapStart, id: Date.now() },
        ]);
      }

      setScore((prev) => prev + 1);
    }, 30);

    return () => clearInterval(gameLoop);
  }, [isGameOver, pipes]);

  useEffect(() => {
    const applyGravity = () => {
      busPosition.setValue(busPosition.__getValue() + GRAVITY);
    };

    if (!isGameOver) {
      gravityInterval.current = setInterval(applyGravity, 30);
    } else {
      clearInterval(gravityInterval.current);
    }

    return () => clearInterval(gravityInterval.current);
  }, [isGameOver]);

  useEffect(() => {
    if (isPressing) {
      jumpInterval.current = setInterval(() => {
        busPosition.setValue(Math.max(busPosition.__getValue() - JUMP_HEIGHT, 0));
      }, 30);
    } else {
      clearInterval(jumpInterval.current);
    }

    return () => clearInterval(jumpInterval.current);
  }, [isPressing]);

  useEffect(() => {
    const checkCollision = () => {
      const busY = busPosition.__getValue();

      if (busY <= 0 || busY + BUS_SIZE >= height) {
        setIsGameOver(true);
      }

      pipes.forEach((pipe) => {
        const isCollidingX = 20 + BUS_SIZE > pipe.x && 20 < pipe.x + PIPE_WIDTH;
        const isCollidingY =
          busY < pipe.gapStart || busY + BUS_SIZE > pipe.gapStart + PIPE_GAP;

        if (isCollidingX && isCollidingY) {
          setIsGameOver(true);
        }
      });
    };

    const collisionCheck = setInterval(checkCollision, 30);
    return () => clearInterval(collisionCheck);
  }, [pipes]);

  const handleRestart = async () => {
    if (score > highScore) {
      setHighScore(score);
      await AsyncStorage.setItem('highScore', score.toString());
    }

    setIsGameOver(false);
    setScore(0);
    setPipes([]);
    busPosition.setValue(height / 2);
  };

  const resetHighScore = async () => {
    setHighScore(0);
    await AsyncStorage.setItem('highScore', '0');
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TapGestureHandler
        onBegan={() => setIsPressing(true)}
        onEnded={() => setIsPressing(false)}
      >
        <View style={styles.container}>
          <Image source={background} style={styles.background} />
          {pipes.map((pipe) => (
            <React.Fragment key={pipe.id}>
              <Image
                source={pipeTop}
                style={{
                  ...styles.pipe,
                  left: pipe.x,
                  bottom: height - pipe.gapStart,
                  height: height - pipe.gapStart, // Ajusta para evitar partes flotantes
                }}
              />
              <Image
                source={pipeBottom}
                style={{
                  ...styles.pipe,
                  left: pipe.x,
                  top: pipe.gapStart + PIPE_GAP,
                  height: pipe.gapStart + PIPE_GAP, // Ajusta para evitar partes flotantes
                }}
              />
            </React.Fragment>
          ))}
          <Animated.Image
            source={autocarro}
            style={{
              ...styles.bus,
              transform: [{ translateY: busPosition }],
            }}
          />
          <Text style={styles.score}>Score: {score}</Text>
          <Text style={styles.highScore}>High Score: {highScore}</Text>
          {isGameOver && (
            <View style={styles.gameOverContainer}>
              <Image source={gameover} style={styles.gameOverImage} />
              <TouchableOpacity style={styles.button} onPress={handleRestart}>
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
  background: { position: 'absolute', height, width, resizeMode: 'cover' },
  bus: {
    position: 'absolute',
    width: BUS_SIZE,
    height: BUS_SIZE,
    resizeMode: 'contain',
    left: 20,
  },
  pipe: {
    position: 'absolute',
    width: PIPE_WIDTH,
    resizeMode: 'stretch',
  },
  score: { position: 'absolute', top: 120, left: 20, fontSize: 24, color: 'white' },
  highScore: { position: 'absolute', top: 150, left: 20, fontSize: 20, color: 'yellow',fontWeight: '700' },
  gameOverContainer: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    right: '20%',
    alignItems: 'center',
  },
  gameOverImage: { width: 200, height: 200, resizeMode: 'contain' },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: 'red',
  },
  buttonText: { fontSize: 18, color: 'white' },
});

export default FlappyGame;
