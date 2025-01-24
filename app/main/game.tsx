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

import background from '../../assets/images/2d/background-.png';
import autocarro from '../../assets/images/2d/autocarro.png';
import tree from '../../assets/images/2d/1.png';
import person from '../../assets/images/2d/2.png';
import cone from '../../assets/images/2d/3.png';
import gameover from '../../assets/images/2d/gameover-14.png';
import multiplier from '../../assets/images/2d/moeda.png';

const { width, height } = Dimensions.get('window');
const BUS_WIDTH = 120;
const BUS_HEIGHT = 80;
const FLOOR_HEIGHT = height - 160;

const GameScreen = () => {
  const [obstacles, setObstacles] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(10);
  const [isMultiplierActive, setIsMultiplierActive] = useState(false);

  const busPosition = useRef(new Animated.Value(0)).current;
  const backgroundPosition = useRef(new Animated.Value(0)).current;
  const isJumping = useRef(false);
  const jumpCount = useRef(0);
  const router = useRouter();

  const obstacleImages = [tree, person, cone];

  // Manejar generación de obstáculos
  useEffect(() => {
    if (isGameOver) return;

    const spawnObstacle = () => {
      const randomObstacle = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
      const randomSize = Math.random() * 50 + 30; // Tamaños entre 30 y 80
      const randomSpeed = Math.random() * 3 + speed; // Velocidad base más aleatoria

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

  // Manejar generación de power-ups
  useEffect(() => {
    if (isGameOver) return;

    const spawnPowerUp = () => {
      setPowerUps((prev) => [
        ...prev,
        {
          x: width,
          id: Date.now(),
          src: multiplier,
          width: 40,
          height: 40,
        },
      ]);
    };

    const interval = setInterval(spawnPowerUp, 10000); // Cada 10 segundos
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Animar el fondo para movimiento continuo
  useEffect(() => {
    if (isGameOver) return;

    const animateBackground = () => {
      backgroundPosition.setValue(0);
      Animated.loop(
        Animated.timing(backgroundPosition, {
          toValue: -width,
          duration: 20000, // Ajustar duración para movimiento lento
          useNativeDriver: false,
        })
      ).start();
    };

    animateBackground();
  }, [isGameOver]);

  // Actualizar obstáculos, power-ups y puntaje
  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (isGameOver) return;

      setObstacles((prev) =>
        prev
          .map((obstacle) => ({ ...obstacle, x: obstacle.x - obstacle.speed }))
          .filter((obstacle) => obstacle.x + obstacle.width > 0)
      );

      setPowerUps((prev) =>
        prev
          .map((powerUp) => ({ ...powerUp, x: powerUp.x - speed }))
          .filter((powerUp) => powerUp.x + powerUp.width > 0)
      );

      setScore((prev) => prev + (isMultiplierActive ? 2 : 1));
      if (score > 0 && score % 100 === 0) setSpeed((prev) => prev + 1);
    }, 30);

    return () => clearInterval(gameLoop);
  }, [isGameOver, speed, score, isMultiplierActive]);

  // Detectar colisiones
  useEffect(() => {
    const busY = FLOOR_HEIGHT - BUS_HEIGHT - busPosition.__getValue();

    obstacles.forEach((obstacle) => {
      const isCollidingX = 20 < obstacle.x + obstacle.width && 20 + BUS_WIDTH > obstacle.x;
      const isCollidingY =
        busY + BUS_HEIGHT > FLOOR_HEIGHT - obstacle.height && busY < FLOOR_HEIGHT;

      if (isCollidingX && isCollidingY) setIsGameOver(true);
    });

    powerUps.forEach((powerUp) => {
      const isCollidingX = 20 < powerUp.x + powerUp.width && 20 + BUS_WIDTH > powerUp.x;
      const isCollidingY =
        busY + BUS_HEIGHT > FLOOR_HEIGHT - powerUp.height && busY < FLOOR_HEIGHT;

      if (isCollidingX && isCollidingY) {
        setPowerUps((prev) => prev.filter((p) => p.id !== powerUp.id));
        setIsMultiplierActive(true);
        setTimeout(() => setIsMultiplierActive(false), 5000); // 5 segundos
      }
    });
  }, [obstacles, powerUps]);

  // Salto del autobús
  const handleJump = () => {
    if (!isGameOver && jumpCount.current < 2) {
      isJumping.current = true;
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
          if (jumpCount.current === 0) isJumping.current = false;
        });
      });
    }
  };

  // Reiniciar juego
  const handleRestart = () => {
    setIsGameOver(false);
    setObstacles([]);
    setPowerUps([]);
    setScore(0);
    setSpeed(10);
    busPosition.setValue(0);
    backgroundPosition.setValue(0);
    setIsMultiplierActive(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TapGestureHandler onActivated={handleJump}>
        <View style={styles.container}>
          {/* Fondo */}
          <Animated.Image
            source={background}
            style={[
              styles.background,
              { transform: [{ translateX: backgroundPosition }] },
            ]}
          />
          <Animated.Image
            source={background}
            style={[
              styles.background,
              {
                left: width,
                transform: [{ translateX: backgroundPosition }],
              },
            ]}
          />

          {/* Autobús */}
          <Animated.Image
            source={autocarro}
            style={[
              styles.bus,
              { top: FLOOR_HEIGHT - BUS_HEIGHT - busPosition.__getValue() },
            ]}
          />

          {/* Obstáculos */}
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

          {/* Power-ups */}
          {powerUps.map((powerUp) => (
            <Image
              key={powerUp.id}
              source={powerUp.src}
              style={{
                ...styles.powerUp,
                left: powerUp.x,
                top: FLOOR_HEIGHT - powerUp.height,
                width: powerUp.width,
                height: powerUp.height,
              }}
            />
          ))}

          {/* Puntaje */}
          <Text style={styles.score}>Score: {score}</Text>

          {/* Pantalla de Game Over */}
          {isGameOver && (
            <View style={styles.gameOverContainer}>
              <Image source={gameover} style={styles.gameOverImage} />
              <Text style={styles.finalScore}>Final Score: {score}</Text>
              <TouchableOpacity style={styles.button} onPress={handleRestart}>
                <Text style={styles.buttonText}>Restart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>Home</Text>
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
  background: { position: 'absolute', width, height, resizeMode: 'stretch' },
  bus: { position: 'absolute', width: BUS_WIDTH, height: BUS_HEIGHT, resizeMode: 'contain', left: 20 },
  obstacle: { position: 'absolute', resizeMode: 'contain' },
  powerUp: { position: 'absolute', resizeMode: 'contain' },
  score: { position: 'absolute', top: 50, left: 20, fontSize: 24, color: 'white' },
  gameOverContainer: {
    position: 'absolute',
    top: '40%',
    left: '20%',
    right: '20%',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  gameOverImage: { width: 200, height: 100, resizeMode: 'contain', marginBottom: 20 },
  finalScore: { fontSize: 20, marginBottom: 20 },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 18 },
});

export default GameScreen;
