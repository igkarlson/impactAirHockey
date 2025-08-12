import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '@/context/SettingsContext';
import { deviceHeight, deviceWidth, scaleX, scaleY } from '@/utils/responsive';
import * as Haptics from 'expo-haptics';
import { useLocalization } from './i18n/hooks';

const width = deviceWidth();
const height = deviceHeight();
const EXTRA_SHIFT_Y = height * 0.05;

// Game constants
const PADDLE_SPEED = 0.8;
const PUCK_SPEED_MULTIPLIER = 4; // 2x faster again (overall 4x from baseline)
const FRICTION = 0.98;
const BOUNCE_DAMPING = 0.8;
// Will be read from settings
const GOAL_SCORE_DEFAULT = 10;

interface GameState {
  player1Score: number;
  player2Score: number;
  gameActive: boolean;
  winner: string | null;
}

interface PhysicsObject {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function GameplayScreen() {
  const { t } = useLocalization();
  const { vibrationEnabled, soundEnabled, goalTarget } = useSettings();
  const goalToWinRef = useRef<number>(goalTarget || GOAL_SCORE_DEFAULT);

  useEffect(() => {
    goalToWinRef.current = goalTarget || GOAL_SCORE_DEFAULT;
  }, [goalTarget]);

  const hitSoundsRef = useRef<any[]>([]);
  const soundIndexRef = useRef<number>(0);
  const lastHitTsRef = useRef<number>(0);
  const audioUnlockedRef = useRef<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { Audio } = await import('expo-av');
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: 1,
          shouldDuckAndroid: true,
          interruptionModeAndroid: 1,
          playThroughEarpieceAndroid: false,
        });
        const localHit = require('../assets/sounds/hockey-pants-impact-hit_gyw0otvd.mp3');
        const urls = [localHit] as const;
        const loaded: any[] = [];
        for (const url of urls) {
          const { sound } = await Audio.Sound.createAsync(
            url as any,
            { volume: 0.6, shouldPlay: false, isLooping: false }
          );
          loaded.push(sound);
        }
        if (isMounted) hitSoundsRef.current = loaded;
      } catch {}
    })();
    return () => {
      isMounted = false;
      if (hitSoundsRef.current.length) {
        hitSoundsRef.current.forEach((s) => s && s.unloadAsync && s.unloadAsync());
        hitSoundsRef.current = [];
      }
    };
  }, []);

  const playHitSound = async () => {
    if (!soundEnabled || !hitSoundsRef.current.length) return;
    const now = Date.now();
    if (now - lastHitTsRef.current < 80) return;
    lastHitTsRef.current = now;
    try {
      const sound = hitSoundsRef.current[soundIndexRef.current % hitSoundsRef.current.length];
      soundIndexRef.current += 1;
      try { await sound.stopAsync(); } catch {}
      try { await sound.setPositionAsync(0); } catch {}
      await sound.playAsync();
    } catch {}
  };

  const unlockAudioIfNeeded = async () => {
    if (audioUnlockedRef.current || !hitSoundsRef.current.length) return;
    try {
      const sound = hitSoundsRef.current[0];
      await sound.setPositionAsync(0);
      await sound.playAsync();
      audioUnlockedRef.current = true;
    } catch {}
  };
  
  // Game state
  const [gameState, setGameState] = useState<GameState>({
    player1Score: 0,
    player2Score: 0,
    gameActive: true,
    winner: null,
  });

  const [isPaused, setIsPaused] = useState(false);

  // Physics objects
  const puck = useRef<PhysicsObject>({
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    radius: 15 * scaleX,
  });

  const leftPaddle = useRef<PhysicsObject>({
    x: width / 2,
    y: height - 90 * scaleY, // Positioned between center and bottom goal
    vx: 0,
    vy: 0,
    radius: 25 * scaleX,
  });

  const rightPaddle = useRef<PhysicsObject>({
    x: width / 2,
    y: 90 * scaleY, // Positioned between top goal and center
    vx: 0,
    vy: 0,
    radius: 25 * scaleX,
  });

  // Animated values for smooth movement
  const puckX = useSharedValue(width / 2);
  const puckY = useSharedValue(height / 2);
  const leftPaddleX = useSharedValue(width / 2);
  const leftPaddleY = useSharedValue(height - 90 * scaleY); // Positioned between center and bottom goal
  const rightPaddleX = useSharedValue(width / 2);
  const rightPaddleY = useSharedValue(90 * scaleY); // Positioned between top goal and center

  // Gesture start anchors
  const leftStartX = useRef(leftPaddleX.value);
  const leftStartY = useRef(leftPaddleY.value);
  const rightStartX = useRef(rightPaddleX.value);
  const rightStartY = useRef(rightPaddleY.value);

  // Direct position updates for instant response
  const updatePaddlePosition = (paddle: 'left' | 'right', x: number, y: number) => {
    if (paddle === 'left') {
      leftPaddleX.value = x;
      leftPaddleY.value = y;
      leftPaddle.current.x = x;
      leftPaddle.current.y = y;
    } else {
      rightPaddleX.value = x;
      rightPaddleY.value = y;
      rightPaddle.current.x = x;
      rightPaddle.current.y = y;
    }
  };

  // Game board boundaries (LOCAL coordinates inside styles.gameBoard)
  // styles.gameBoard: top=100*scaleY, left=20*scaleX, right=20*scaleX, bottom=60*scaleY
  const boardLeft = 0;
  const boardRight = width - 40 * scaleX;
  const boardTop = 0;
  const boardBottom = height - 160 * scaleY;

  // Derived board geometry
  const boardWidth = boardRight - boardLeft;
  const boardHeight = boardBottom - boardTop;
  const centerLineY = boardTop + boardHeight * 0.5;
  const topGoalZoneTop = boardTop + boardHeight * 0.01;
  const topGoalZoneBottom = topGoalZoneTop + boardHeight * 0.05;
  const bottomGoalZoneBottom = boardBottom - boardHeight * 0.01;
  const bottomGoalZoneTop = bottomGoalZoneBottom - boardHeight * 0.05;

  const handleBack = () => {
    router.back();
  };

  const resetGame = () => {
    setGameState({
      player1Score: 0,
      player2Score: 0,
      gameActive: true,
      winner: null,
    });

    const paddleRadiusX = 25 * scaleX;
    const paddleRadiusY = 21 * scaleY;

    const centerX = (boardLeft + boardRight) / 2;
    const centerY = (boardTop + boardBottom) / 2;

    const leftMinY = centerLineY + paddleRadiusY;
    const leftMaxY = bottomGoalZoneTop - paddleRadiusY;
    const rightMinY = topGoalZoneBottom + paddleRadiusY;
    const rightMaxY = centerLineY - paddleRadiusY;

    const leftY = Math.max(leftMinY, Math.min(leftMaxY, centerY + (boardBottom - centerLineY) * 0.25));
    const rightY = Math.max(rightMinY, Math.min(rightMaxY, centerY - (centerLineY - boardTop) * 0.25));

    puck.current.x = centerX;
    puck.current.y = centerY;
    puck.current.vx = 0;
    puck.current.vy = 0;

    puckX.value = centerX;
    puckY.value = centerY;

    leftPaddle.current.x = centerX;
    leftPaddle.current.y = leftY;
    rightPaddle.current.x = centerX;
    rightPaddle.current.y = rightY;

    leftPaddleX.value = centerX;
    leftPaddleY.value = leftY;
    rightPaddleX.value = centerX;
    rightPaddleY.value = rightY;
  };

  const checkGoal = (puckX: number, puckY: number) => {
    // Check if puck is in the actual goal areas using compact, mobile-friendly coordinates
    const goalWidth = width * 0.2; // 20% of screen width for goal width (reduced from 25%)
    const goalHeight = height * 0.05; // 5% of screen height for goal height (reduced from 8%)
    
    // Top goal coordinates relative to board
    const topGoalLeft = boardLeft + (boardWidth - goalWidth) / 2;
    const topGoalRight = boardLeft + (boardWidth + goalWidth) / 2;
    const topGoalTop = topGoalZoneTop;
    const topGoalBottom = topGoalZoneBottom;
    
    // Bottom goal coordinates relative to board
    const bottomGoalLeft = boardLeft + (boardWidth - goalWidth) / 2;
    const bottomGoalRight = boardLeft + (boardWidth + goalWidth) / 2;
    const bottomGoalTop = bottomGoalZoneTop;
    const bottomGoalBottom = bottomGoalZoneBottom;

    
    // Check if puck is in top goal (Player 1 scores) - must be INSIDE topGoalArea
    if (puckX >= topGoalLeft && puckX <= topGoalRight && 
        puckY >= topGoalTop && puckY <= topGoalBottom) {
      console.log('GOAL! Player 1 scored in top goal area');
      setGameState(prev => {
        const newScore = prev.player1Score + 1;
        if (newScore >= goalToWinRef.current) {
          return { ...prev, player1Score: newScore, gameActive: false, winner: t('player1') };
        }
        return { ...prev, player1Score: newScore };
      });
      return true;
    }
    
    // Check if puck is in bottom goal (Player 2 scores) - must be INSIDE bottomGoalArea
    if (puckX >= bottomGoalLeft && puckX <= bottomGoalRight && 
        puckY >= bottomGoalTop && puckY <= bottomGoalBottom) {
      console.log('GOAL! Player 2 scored in bottom goal area');
      setGameState(prev => {
        const newScore = prev.player2Score + 1;
        if (newScore >= goalToWinRef.current) {
          return { ...prev, player2Score: newScore, gameActive: false, winner: t('player2') };
        }
        return { ...prev, player2Score: newScore };
      });
      return true;
    }
    
    return false;
  };

  const resetPuckAfterGoal = () => {
    // Reset puck to exact center of the board
    const centerX = (boardLeft + boardRight) / 2;
    const centerY = (boardTop + boardBottom) / 2;
    puck.current.x = centerX;
    puck.current.y = centerY;
    puck.current.vx = 0;
    puck.current.vy = 0;
    
    puckX.value = centerX;
    puckY.value = centerY;
  };

  const scoringLockRef = useRef(false);

  // Start the game with some initial puck movement
  useEffect(() => {
    // Give the puck some initial movement to start the game
    puck.current.vx = (Math.random() - 0.5) * 4;
    puck.current.vy = (Math.random() - 0.5) * 4;
  }, []);

  const updatePhysics = () => {
    if (!gameState.gameActive || isPaused) return;

    // Update puck physics (double speed)
    puck.current.x += puck.current.vx * PUCK_SPEED_MULTIPLIER;
    puck.current.y += puck.current.vy * PUCK_SPEED_MULTIPLIER;
    
    // Apply friction
    puck.current.vx *= FRICTION;
    puck.current.vy *= FRICTION;

    // Check board boundaries with improved bounce physics
    if (puck.current.x - puck.current.radius < boardLeft) {
      puck.current.x = boardLeft + puck.current.radius;
      puck.current.vx = -puck.current.vx * BOUNCE_DAMPING;
      // Add some randomness to prevent predictable bounces
      puck.current.vy += (Math.random() - 0.5) * 2;
    }
    if (puck.current.x + puck.current.radius > boardRight) {
      puck.current.x = boardRight - puck.current.radius;
      puck.current.vx = -puck.current.vx * BOUNCE_DAMPING;
      puck.current.vy += (Math.random() - 0.5) * 2;
    }
    if (puck.current.y - puck.current.radius < boardTop) {
      puck.current.y = boardTop + puck.current.radius;
      puck.current.vy = -puck.current.vy * BOUNCE_DAMPING;
      puck.current.vx += (Math.random() - 0.5) * 2;
    }
    if (puck.current.y + puck.current.radius > boardBottom) {
      puck.current.y = boardBottom - puck.current.radius;
      puck.current.vy = -puck.current.vy * BOUNCE_DAMPING;
      puck.current.vx += (Math.random() - 0.5) * 2;
    }

    // Check for goals (single count per entry)
    if (!scoringLockRef.current && checkGoal(puck.current.x, puck.current.y)) {
      scoringLockRef.current = true;
      resetPuckAfterGoal();
      setTimeout(() => {
        scoringLockRef.current = false;
      }, 250);
    }

    // Check paddle collisions
    checkPaddleCollision(leftPaddle.current);
    checkPaddleCollision(rightPaddle.current);

    // Update animated values
    puckX.value = puck.current.x;
    puckY.value = puck.current.y;
  };

  const checkPaddleCollision = (paddle: PhysicsObject) => {
    const dx = puck.current.x - paddle.x;
    const dy = puck.current.y - paddle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < puck.current.radius + paddle.radius) {
      // Collision detected - calculate proper bounce direction
      const angle = Math.atan2(dy, dx);
      const speed = Math.sqrt(puck.current.vx * puck.current.vx + puck.current.vy * puck.current.vy);
      
      // Calculate paddle's movement to influence puck direction
      const paddleSpeedX = paddle.vx;
      const paddleSpeedY = paddle.vy;
      
      // Bounce the puck away from the paddle with improved physics
      const bounceSpeed = Math.max(speed, 3); // Minimum speed to keep game interesting
      
      // Add paddle movement influence to puck direction
      puck.current.vx = Math.cos(angle) * bounceSpeed + paddleSpeedX * 0.3;
      puck.current.vy = Math.sin(angle) * bounceSpeed + paddleSpeedY * 0.3;
      
      // Move puck outside paddle to prevent sticking
      const overlap = (puck.current.radius + paddle.radius - distance) + 2;
      puck.current.x += Math.cos(angle) * overlap;
      puck.current.y += Math.sin(angle) * overlap;
      
      // Haptics on collision
      if (vibrationEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      // Sound on collision
      playHitSound();

      // Ensure minimum velocity to prevent slow movement
      if (Math.abs(puck.current.vx) < 2) {
        puck.current.vx = puck.current.vx > 0 ? 2 : -2;
      }
      if (Math.abs(puck.current.vy) < 2) {
        puck.current.vy = puck.current.vy > 0 ? 2 : -2;
      }
    }
  };

  // Remove momentum: paddles directly follow the finger path

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      updatePhysics();
    }, 8);
    return () => clearInterval(gameLoop);
  }, [gameState.gameActive]);

  // Animated styles
  const puckAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: puckX.value - 15 * scaleX },
      { translateY: puckY.value - 12.5 * scaleY },
    ],
  }));

  // Paddle styles
  const leftPaddleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: leftPaddleX.value - 25 * scaleX },
      { translateY: leftPaddleY.value - 21 * scaleY },
    ],
  }));

  const rightPaddleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: rightPaddleX.value - 25 * scaleX },
      { translateY: rightPaddleY.value - 21 * scaleY },
    ],
  }));

  const onLeftPaddleGesture = (event: PanGestureHandlerGestureEvent) => {
    if (!gameState.gameActive || isPaused) return;
    
    const { translationX, translationY, state } = event.nativeEvent;

    if (state === State.BEGAN) {
      leftStartX.current = leftPaddleX.value;
      leftStartY.current = leftPaddleY.value;
    }
    if (state === State.ACTIVE) {
      const targetX = leftStartX.current + translationX;
      const targetY = leftStartY.current + translationY;
      const paddleRadiusX = 25 * scaleX;
      const paddleRadiusY = 21 * scaleY; // half of 42 * scaleY
      const newX = Math.max(paddleRadiusX, Math.min(boardRight - paddleRadiusX, targetX));
      const minY = centerLineY + paddleRadiusY;
      const maxY = bottomGoalZoneTop - paddleRadiusY;
      const newY = Math.max(minY, Math.min(maxY, targetY));
      updatePaddlePosition('left', newX, newY);
    }
  };

  const onRightPaddleGesture = (event: PanGestureHandlerGestureEvent) => {
    if (!gameState.gameActive || isPaused) return;
    
    const { translationX, translationY, state } = event.nativeEvent;

    if (state === State.BEGAN) {
      rightStartX.current = rightPaddleX.value;
      rightStartY.current = rightPaddleY.value;
    }
    if (state === State.ACTIVE) {
      const targetX = rightStartX.current + translationX;
      const targetY = rightStartY.current + translationY;
      const paddleRadiusX = 25 * scaleX;
      const paddleRadiusY = 21 * scaleY; // half of 42 * scaleY
      const newX = Math.max(paddleRadiusX, Math.min(boardRight - paddleRadiusX, targetX));
      const minY = topGoalZoneBottom + paddleRadiusY;
      const maxY = centerLineY - paddleRadiusY;
      const newY = Math.max(minY, Math.min(maxY, targetY));
      updatePaddlePosition('right', newX, newY);
    }
  };

  useEffect(() => {
    const paddleRadiusY = 21 * scaleY;
    const minY = topGoalZoneBottom + paddleRadiusY;
    const maxY = centerLineY - paddleRadiusY;
    const initialRightY = Math.max(minY, Math.min(maxY, rightPaddleY.value));
    if (initialRightY !== rightPaddleY.value) {
      updatePaddlePosition('right', rightPaddleX.value, initialRightY);
    }
  }, []);

  useEffect(() => {
    const paddleRadiusY = 21 * scaleY;
    const minY = centerLineY + paddleRadiusY;
    const maxY = bottomGoalZoneTop - paddleRadiusY;
    const initialLeftY = Math.max(minY, Math.min(maxY, leftPaddleY.value));
    if (initialLeftY !== leftPaddleY.value) {
      updatePaddlePosition('left', leftPaddleX.value, initialLeftY);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <ThemedView style={styles.container}>
          <LinearGradient
            colors={['#0A1B35', '#0B2A55']}
            style={styles.backgroundGradient}
          />
          <LinearGradient
            colors={['#6BB3E1', '#12649A']}
            style={styles.overlayGradient}
          />
        

          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <View style={styles.backButtonBackground} />
            <MaterialCommunityIcons name="arrow-left" size={34} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.pauseButton} onPress={() => setIsPaused(true)}>
            <View style={styles.pauseButtonBackground} />
            <MaterialCommunityIcons name="pause" size={28} color="white" />
          </TouchableOpacity>

          <View style={styles.gameBoard}>
            {/* Main white background */}
            <View style={styles.boardBackground} />
            
            {/* Complex border with red background */}
            <View style={styles.borderContainer}>
              <View style={styles.redBackground} />
              <View style={styles.borderStroke} />
              
              {/* Dot pattern on white background */}
              <View>
                {Array.from({ length: 19 }, (_, groupIndex) => (
                  <View key={groupIndex} style={styles.whiteDotGroup}>
                    {Array.from({ length: 17 }, (_, dotIndex) => (
                      <View
                        key={dotIndex}
                        style={[
                          styles.whiteDot,
                          {
                            left: dotIndex * 17 * scaleX,
                          }
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
              
              {/* Decorative rectangles */}
              <View style={styles.rectangle9} />
              <View style={styles.rectangle10} />
              <View style={styles.rectangle11} />
              <View style={styles.rectangle13} />
            </View>

            {/* Player control zones */}
            {/* Removed since both players can move anywhere */}
            
            {/* Center line */}
            <View style={styles.centerLine} />
            
            {/* Center circle */}
            <View style={styles.centerCircle} />
            
            {/* Top goal */}
            <View style={styles.topGoal} />
            
            {/* Line under top goal */}
            <View style={styles.topGoalLine} />
            
            {/* Bottom goal */}
            <View style={styles.bottomGoal} />
            
            {/* Line above bottom goal */}
            <View style={styles.bottomGoalLine} />
            
            {/* Center goal group */}
            <View style={styles.centerGoalGroup}>
              <View style={styles.centerGoalLine} />
              <View style={styles.centerGoalTop} />
              <View style={styles.centerGoalBottom} />
              <View style={styles.centerGoalCircle} />
            </View>
            
            {/* Visual Goal Areas */}
            <View style={styles.topGoalArea} />
            <View style={styles.bottomGoalArea} />
            
            {/* Goal Zone Indicators - Show exact scoring areas */}
            <View style={styles.topGoalZone} />
            <View style={styles.bottomGoalZone} />
            
            {/* Goal Indicators */}
            <View style={[styles.goalIndicator, styles.topGoalIndicator]} />
            <View style={[styles.goalIndicator, styles.bottomGoalIndicator]} />
            
            {/* Left paddle - Player 1 (Blue) */}
            <PanGestureHandler onGestureEvent={(e) => { unlockAudioIfNeeded(); onLeftPaddleGesture(e); }} onHandlerStateChange={(e) => {
              if (e.nativeEvent.state === State.BEGAN) {
                leftStartX.current = leftPaddleX.value;
                leftStartY.current = leftPaddleY.value;
              }
            }}>
              <Animated.View style={[styles.leftPaddle, leftPaddleAnimatedStyle]}>
                <View style={styles.paddleInner} />
                <View style={styles.paddleGlow} />
              </Animated.View>
            </PanGestureHandler>
            
            {/* Right paddle - Player 2 (Red) */}
            <PanGestureHandler onGestureEvent={(e) => { unlockAudioIfNeeded(); onRightPaddleGesture(e); }} onHandlerStateChange={(e) => {
              if (e.nativeEvent.state === State.BEGAN) {
                rightStartX.current = rightPaddleX.value;
                rightStartY.current = rightPaddleY.value;
              }
            }}>
              <Animated.View style={[styles.rightPaddle, rightPaddleAnimatedStyle]}>
                <View style={styles.paddleInner} />
                <View style={styles.paddleGlow} />
              </Animated.View>
            </PanGestureHandler>
            
            {/* Puck */}
            <Animated.View style={[styles.puck, puckAnimatedStyle]} />
          </View>

          <View style={styles.scoreContainer}>
            <ThemedText style={styles.scoreText}>
              {gameState.player1Score}:{gameState.player2Score}
            </ThemedText>
          </View>

          <View style={styles.playerLabelLeft}>
            <ThemedText style={styles.playerLabel}>{t('player1')}</ThemedText>
          </View>
          <View style={styles.playerLabelRight}>
            <ThemedText style={styles.playerLabel}>{t('player2')}</ThemedText>
          </View>

          {/* Win Modal */}
          {!gameState.gameActive && (
            <View style={styles.pauseOverlay}>
              <View style={styles.winModal}>
                <ThemedText style={styles.winTitle}>{gameState.winner}</ThemedText>
                <ThemedText style={styles.winSubtitle}>
                  {gameState.player1Score}:{gameState.player2Score}
                </ThemedText>
                <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
                  <ThemedText style={styles.modalButtonText}>{t('play') || 'Play'}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/') }>
                  <ThemedText style={styles.modalButtonText}>{t('mainMenu') || 'Main Menu'}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {isPaused && (
            <View style={styles.pauseOverlay}>
              <View style={styles.pauseModal}>
                <TouchableOpacity style={styles.modalButton} onPress={() => setIsPaused(false)}>
                  <ThemedText style={styles.modalButtonText}>{t('continue') || 'Continue'}</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => router.push('/') }>
                  <ThemedText style={styles.modalButtonText}>{t('mainMenu') || 'Main Menu'}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ThemedView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,

  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dotPattern: {
    position: 'absolute',
    top: -70 * scaleY,
    left: -47 * scaleX,
    opacity: 0.1,
  },
  dotGroup: {
    width: 258 * scaleX,
    height: 3 * scaleY,
    marginBottom: 19 * scaleY,
  },
  dot: {
    position: 'absolute',
    width: 3 * scaleX,
    height: 3 * scaleY,
    borderRadius: 1.5 * scaleX,
    backgroundColor: '#DDDDDD',
  },
  backButton: {
    position: 'absolute',
    top: 30 * scaleY, // raised above
    left: 25 * scaleX,
    width: 46 * scaleX,
    height: 46 * scaleY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonBackground: {
    position: 'absolute',
    width: 46 * scaleX,
    height: 46 * scaleY,
    backgroundColor: '#F94444',
    borderRadius: 2 * scaleX,
  },
  pauseButton: {
    position: 'absolute',
    top: 30 * scaleY, // raised above
    right: 25 * scaleX,
    width: 46 * scaleX,
    height: 46 * scaleY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButtonBackground: {
    position: 'absolute',
    width: 46 * scaleX,
    height: 46 * scaleY,
    backgroundColor: '#4692F0',
    borderRadius: 2 * scaleX,
  },
  gameBoard: {
    position: 'absolute',
    top: 100 * scaleY + EXTRA_SHIFT_Y,
    left: 20 * scaleX,
    right: 20 * scaleX,
    bottom: 60 * scaleY - EXTRA_SHIFT_Y,
  },
  boardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: '2%',
    backgroundColor: '#F33535',
    borderRadius: 41 * scaleX,
  },
  borderContainer: {
    position: 'absolute',

    left: 17 * scaleX,
    right: 17 * scaleX,
    height: '95%',
    borderRadius: 35 * scaleX,
  },
  redBackground: {
    position: 'absolute',
    top: '3%',
    bottom: '0%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 35 * scaleX,
  },
  borderStroke: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1 * scaleX,
    borderColor: '#2375DC',
    borderRadius: 35 * scaleX,
    opacity: 0.2,
  },
  rectangle9: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    bottom: '100%',
    borderWidth: 10,
    borderColor: '#2375DC',
    backgroundColor: '#2375DC',
  },
  rectangle10: {
    position: 'absolute',
    top: '100%',
    left: '10%',
    right: '10%',
    bottom: 0,
    borderWidth: 10,
    borderColor: '#2375DC',
  },
  rectangle11: {
    position: 'absolute',
    width: '6%',
    right: '100%',
    top: '12%',
    bottom: '6%',
    backgroundColor: '#2375DC',
  },
  rectangle13: {
    position: 'absolute',
    left: '100%',
    top: '12%',
    bottom: '6%',
    width: '6%',
    backgroundColor: '#2375DC',
  },
  centerLine: {
    position: 'absolute',
    top: '50%',
    left: 15 * scaleX,
    right: 15 * scaleX,
    height: 8 * scaleY,
    backgroundColor: '#2375DC',
    marginTop: -4 * scaleY,
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 18 * scaleX,
    height: 18 * scaleY,
    backgroundColor: '#2375DC',
    borderRadius: 9 * scaleX,
    marginTop: -9 * scaleY,
    marginLeft: -9 * scaleX,
  },
  topGoal: {
    position: 'absolute',
    top: '2%',
    left: '50%',
    width: 87 * scaleX,
    height: 43.5 * scaleY,
    borderColor: '#2379E4',
    borderWidth: 7 * scaleX,
    borderBottomLeftRadius: 87 * scaleY,
    borderBottomRightRadius: 87 * scaleY,
    marginLeft: -43.5 * scaleX,
  },
  topGoalLine: {
    position: 'absolute',
    top: 90 * scaleY, // Adjust based on topGoal height
    width: '100%',
    height: 1 * scaleY, // Thin line
    backgroundColor: '#2375DC',
    borderWidth: 5,
    borderColor: '#2375DC',
  },
  bottomGoal: {
    position: 'absolute',
    bottom: 17 * scaleY,
    left: '50%',
    width: 87 * scaleX,
    height: 43.5 * scaleY,
    borderColor: '#2379E4',
    borderWidth: 7 * scaleX,
    borderTopLeftRadius: 87 * scaleY,
    borderTopRightRadius: 87 * scaleY,
    marginLeft: -43.5 * scaleX,
  },
  bottomGoalLine: {
    position: 'absolute',
    bottom: 90 * scaleY, // Adjust based on bottomGoal height
    width: '100%',
    backgroundColor: '#2375DC',
    borderWidth: 5,
    borderColor: '#2375DC',
  },
  centerGoalGroup: {
    position: 'absolute',
    top: '50%',
    left: 13 * scaleX,
    right: 13 * scaleX,
    height: 76 * scaleY,
    marginTop: -38 * scaleY,
  },
  centerGoalLine: {
    position: 'absolute',
    top: 34 * scaleY,
    backgroundColor: '#2375DC',
    borderWidth: 5,
    borderColor: '#2375DC',
    width: '100%',
  },
  centerGoalTop: {
    position: 'absolute',
    top: '6%',
    left: '37%',
    width: 76 * scaleX,
    height: 38 * scaleY,
    borderColor: '#2375DC',
    borderWidth: 7 * scaleX,
    borderTopLeftRadius: 76 * scaleY,
    borderTopRightRadius: 76 * scaleY,
  },
  centerGoalBottom: {
    position: 'absolute',
    bottom: '6%',
    left: '37%',
    width: 76 * scaleX,
    height: 38 * scaleY,
    borderColor: '#2375DC',
    borderWidth: 7 * scaleX,
    borderBottomLeftRadius: 76 * scaleY,
    borderBottomRightRadius: 76 * scaleY,

  },
  centerGoalCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 18 * scaleX,
    height: 18 * scaleY,
    backgroundColor: '#2375DC',
    borderRadius: 9 * scaleX,
    marginTop: -9 * scaleY,
    marginLeft: -9 * scaleX,
  },
  topGoalArea: {
    position: 'absolute',
    top: '1%',
    left: '50%',
    width: '20%',
    height: '5%',
    backgroundColor: 'transparent',
    borderRadius: 1000,
    marginLeft: '-10%',
  },
  bottomGoalArea: {
    position: 'absolute',
    bottom: '1%',
    left: '50%',
    width: '20%',
    height: '5%',
    backgroundColor: 'transparent',
    borderRadius: 1000,
    marginLeft: '-10%',
  },
  topGoalZone: {
    position: 'absolute',
    top: '1%',
    left: '50%',
    width: '20%',
    height: '5%',
    backgroundColor: 'transparent',
    borderRadius: 1000,
    marginLeft: '-10%',
    borderWidth: 1,
    borderColor: '#FF0000', // Red border for goal zone
    opacity: 0.1,
  },
  bottomGoalZone: {
    position: 'absolute',
    bottom: '1%',
    left: '50%',
    width: '20%',
    height: '5%',
    backgroundColor: 'transparent',
    borderRadius: 1000,
    marginLeft: '-10%',
    borderWidth: 1,
    borderColor: '#FF0000', // Red border for goal zone
    opacity: 0.1,
  },
  goalIndicator: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF3131', // Red color for goal indicator
    opacity: 0.8,
  },
  topGoalIndicator: {
    top: '1%',
    left: '50%',
    marginLeft: -5,
  },
  bottomGoalIndicator: {
    bottom: '1%',
    left: '50%',
    marginLeft: -5,
  },
  leftPaddle: {
    position: 'absolute',
    width: 50 * scaleX, // Reduced from 59 * scaleX
    height: 42 * scaleY, // Reduced from 59 * scaleY
    backgroundColor: '#318CFF',
    borderRadius: 25 * scaleX, // Reduced from 29.5 * scaleX
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.37,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 5,
  },
  rightPaddle: {
    position: 'absolute',
    width: 50 * scaleX, // Reduced from 59 * scaleX
    height: 42 * scaleY, // Reduced from 59 * scaleY
    backgroundColor: '#FF3131',
    borderRadius: 25 * scaleX, // Reduced from 29.5 * scaleX
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.37,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 5,
  },
  puck: {
    position: 'absolute',
    width: 30 * scaleX,
    height: 25 * scaleY,
    backgroundColor: '#000000',
    borderRadius: 15 * scaleX,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    zIndex: 10, // Ensure puck is on top
  },
  scoreContainer: {
    position: 'absolute',
    top: 60 * scaleY + EXTRA_SHIFT_Y, // Further reduced from 70 * scaleY
    left: 130 * scaleX,
    width: 95 * scaleX,
    height: 35 * scaleY,
    backgroundColor: '#4692F0',
    borderRadius: 6 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 22 * Math.min(scaleX, scaleY),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  playerLabelLeft: {
    position: 'absolute',
    top: 60 * scaleY + EXTRA_SHIFT_Y + 8 * scaleY,
    left: 40 * scaleX,
  },
  playerLabelRight: {
    position: 'absolute',
    top: 60 * scaleY + EXTRA_SHIFT_Y + 8 * scaleY,
    right: 40 * scaleX,
  },
  playerLabel: {
    fontSize: 14 * Math.min(scaleX, scaleY),
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1 * scaleX,
  },
  whiteDotGroup: {
    left: '2%',
    top: '8.5%',
    height: 3 * scaleY,
    marginBottom: 19 * scaleY,

  },
  whiteDot: {
    position: 'absolute',
    width: 3 * scaleX,
    height: 3 * scaleY,
    borderRadius: 1.5 * scaleX,
    backgroundColor: '#DDDDDD',
  },
  gameOverModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 100,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    elevation: 100,
  },
  pauseModal: {
    width: 260 * scaleX,
    padding: 20 * scaleX,
    backgroundColor: '#0F407E',
    borderRadius: 8 * scaleX,
    gap: 16 * scaleY,
  },
  winModal: {
    width: 280 * scaleX,
    paddingVertical: 24 * scaleY,
    paddingHorizontal: 20 * scaleX,
    backgroundColor: '#0F407E',
    borderRadius: 10 * scaleX,
    gap: 14 * scaleY,
    alignItems: 'center',
  },
  winTitle: {
    fontSize: 22 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1 * scaleX,
  },
  winSubtitle: {
    fontSize: 18 * Math.min(scaleX, scaleY),
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    
  },
  modalButton: {
    height: 46 * scaleY,
    backgroundColor: '#F94444',
    borderRadius: 2 * scaleX,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1 * scaleX,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10 * scaleX,
    padding: 20 * scaleX,
    alignItems: 'center',
  },
  winnerText: {
    fontSize: 24 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 20 * scaleX,
  },
  playAgainButton: {
    backgroundColor: '#4692F0',
    paddingVertical: 10 * scaleX,
    paddingHorizontal: 20 * scaleX,
    borderRadius: 5 * scaleX,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 18 * Math.min(scaleX, scaleY),
    fontWeight: 'bold',
  },
  paddleInner: {
    position: 'absolute',
    top: 6 * scaleY, // Adjusted for smaller paddle
    left: 6 * scaleX, // Adjusted for smaller paddle
    right: 6 * scaleX, // Adjusted for smaller paddle
    bottom: 6 * scaleY, // Adjusted for smaller paddle
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 19 * scaleX, // Adjusted for smaller paddle
  },
  paddleGlow: {
    position: 'absolute',
    top: -8 * scaleY, // Adjusted for smaller paddle
    left: -8 * scaleX, // Adjusted for smaller paddle
    right: -8 * scaleX, // Adjusted for smaller paddle
    bottom: -8 * scaleY, // Adjusted for smaller paddle
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25 * scaleX, // Adjusted for smaller paddle
    opacity: 0.5,
  },
}); 