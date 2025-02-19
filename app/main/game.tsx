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

  // Posiciones animadas
  const busPosition = useRef(new Animated.Value(0)).current;
  const backgroundPosition = useRef(new Animated.Value(0)).current;
  // Almacenamos el valor actual de busPosition usando un listener
  const busPositionValue = useRef(0);
  const jumpCount = useRef(0);
  const router = useRouter();

  const obstacleImages = [tree, person, cone];

  // Listener para obtener el valor actual de busPosition sin usar __getValue()
  useEffect(() => {
    const listenerId = busPosition.addListener(({ value }) => {
      busPositionValue.current = value;
    });
    return () => {
      busPosition.removeListener(listenerId);
    };
  }, [busPosition]);

  // Cargar High Score de AsyncStorage
  useEffect(() => {
    const fetchHighScore = async () => {
      const storedHighScore = await AsyncStorage.getItem('highScore');
      if (storedHighScore) setHighScore(parseInt(storedHighScore, 10));
    };
    fetchHighScore();
  }, []);

  // Game loop: incrementa score y aumenta velocidad cada 100 puntos
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (isGameOver) return;
      setScore(prev => prev + 1);
      if (score > 0 && score % 100 === 0) {
        setSpeed(prev => prev + 1);
      }
    }, 30);
    return () => clearInterval(gameLoop);
  }, [isGameOver, score]);

  // Spawnea obstáculos cada 2000ms
  useEffect(() => {
    if (isGameOver) return;
    const spawnObstacle = () => {
      const randomObstacle = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
      const randomSize = Math.random() * 50 + 30;
      const randomSpeed = Math.random() * 3 + speed;
      setObstacles(prev => [
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

  // Animación de fondo en loop
  useEffect(() => {
    Animated.loop(
      Animated.timing(backgroundPosition, {
        toValue: -width,
        duration: 40000,
        useNativeDriver: false,
      })
    ).start();
  }, [isGameOver]);

  // Movimiento de obstáculos: se mueven hacia la izquierda y se eliminan si salen de la pantalla
  useEffect(() => {
    const obstacleLoop = setInterval(() => {
      if (isGameOver) return;
      setObstacles(prev =>
        prev
          .map(obstacle => ({ ...obstacle, x: obstacle.x - obstacle.speed }))
          .filter(obstacle => obstacle.x + obstacle.width > 0)
      );
    }, 30);
    return () => clearInterval(obstacleLoop);
  }, [isGameOver]);

  // Detección de colisiones
  useEffect(() => {
    const collisionLoop = setInterval(() => {
      if (isGameOver) return;
      // Calcula la posición vertical actual del autobús
      const busY = FLOOR_HEIGHT - BUS_HEIGHT - busPositionValue.current;
      obstacles.forEach(obstacle => {
        // Condición de colisión: comprobación de intersección en X e Y
        const isCollidingX = (20 < obstacle.x + obstacle.width - 10) && (20 + BUS_WIDTH - 10 > obstacle.x);
        const isCollidingY = (busY + BUS_HEIGHT - 10 > FLOOR_HEIGHT - obstacle.height) && (busY + 10 < FLOOR_HEIGHT);
        if (isCollidingX && isCollidingY) setIsGameOver(true);
      });
    }, 30);
    return () => clearInterval(collisionLoop);
  }, [obstacles, isGameOver]);

  // Función para convertir "HH:MM" a minutos desde medianoche (no se usa en esta versión, pero se puede extender)
  const parseTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") {
      console.warn("parseTime recibió un valor inválido:", timeStr);
      return 0;
    }
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // Maneja el salto (doble salto permitido)
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

  // Reinicia el juego y guarda el High Score
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
          {/* Fondo duplicado para efecto de scroll */}
          <Animated.Image
            source={background}
            style={[styles.background, { transform: [{ translateX: backgroundPosition }] }]}
          />
          <Animated.Image
            source={background}
            style={[styles.background, { left: width, transform: [{ translateX: backgroundPosition }] }]}
          />
          {/* Autobús */}
          <Animated.Image
            source={autocarro}
            style={[
              styles.bus,
              { top: FLOOR_HEIGHT - BUS_HEIGHT - busPositionValue.current },
            ]}
          />
          {/* Obstáculos */}
          {obstacles.map(obstacle => (
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
  bus: {
    position: 'absolute',
    width: BUS_WIDTH,
    height: BUS_HEIGHT,
    resizeMode: 'contain',
    left: 20,
  },
  obstacle: { position: 'absolute', resizeMode: 'contain' },
  score: { position: 'absolute', top: 120, left: 20, fontSize: 24, color: 'white' },
  highScore: { position: 'absolute', top: 150, left: 20, fontSize: 20, color: 'yellow', fontWeight: '700' },
  gameOverContainer: { position: 'absolute', top: '20%', left: '20%', right: '20%', alignItems: 'center' },
  gameOverImage: { width: 200, height: 200, resizeMode: 'contain' },
  finalScore: { fontSize: 20, color: 'white', marginTop: 20 },
  button: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginTop: 10, alignItems: 'center', width: '100%' },
  buttonText: { fontSize: 18, color: 'white' },
  // Estilos para la información de la parada
  stopContainer: {
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopInfo: { flexDirection: 'row', alignItems: 'center' },
  stopText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  scheduleText: { color: '#fff', fontSize: 14 },
  expandedScheduleText: {
    backgroundColor: '#e0e0e0',
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    fontSize: 14,
    color: '#333',
  },
  busImage: { width: 24, height: 24, marginRight: 8, resizeMode: 'contain' },
  closeButton: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: '#5cb32b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 60,
    width: '90%',
  },
  closeText: { fontWeight: 'bold', textAlign: 'center', color: '#202020', fontSize: 16 },
});

export default GameScreen;
