import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useThemeContext } from "../../context/DarkMode";

const useStyles = makeStyles(theme => ({
  backdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: theme.palette.type === "dark" ? "#121212" : "#ffffff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: theme.zIndex.drawer + 1,
    overflow: "hidden"
  },
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem"
  },
  logoContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  typewriter: {
    fontSize: "3rem",
    fontWeight: "bold",
    fontFamily: "'Roboto', sans-serif",
    color: theme.palette.primary.main,
    position: "relative",
    "&::after": {
      content: '"|"',
      position: "absolute",
      right: "-0.5rem",
      animation: "$blink 1s infinite"
    }
  },
  "@keyframes blink": {
    "0%, 50%": { opacity: 1 },
    "51%, 100%": { opacity: 0 }
  },
  techGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.1,
    backgroundImage: `linear-gradient(${
      theme.palette.primary.main
    }40 1px, transparent 1px), linear-gradient(90deg, ${
      theme.palette.primary.main
    }40 1px, transparent 1px)`,
    backgroundSize: "50px 50px",
    animation: "$moveGrid 20s linear infinite"
  },
  "@keyframes moveGrid": {
    "0%": { transform: "translate(0, 0)" },
    "100%": { transform: "translate(50px, 50px)" }
  },
  circuitLines: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "400px",
    height: "400px",
    opacity: 0.3
  },
  circuitLine: {
    position: "absolute",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "2px"
  },
  progressContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem"
  },
  progressBar: {
    width: "300px",
    height: "4px",
    backgroundColor: theme.palette.type === "dark" ? "#333" : "#e0e0e0",
    borderRadius: "2px",
    overflow: "hidden",
    position: "relative"
  },
  progressFill: {
    height: "100%",
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    borderRadius: "2px",
    transition: "width 0.3s ease",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      right: 0,
      width: "20px",
      height: "100%",
      background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}80)`,
      animation: "$shimmer 2s ease-in-out infinite"
    }
  },
  "@keyframes shimmer": {
    "0%": { transform: "translateX(-100%)" },
    "100%": { transform: "translateX(100%)" }
  },
  loadingText: {
    fontSize: "1rem",
    color: theme.palette.text.secondary,
    fontFamily: "'Roboto', monospace",
    letterSpacing: "0.1em"
  },
  particles: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none"
  },
  particle: {
    position: "absolute",
    width: "2px",
    height: "2px",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    opacity: 0.6
  }
}));

const TechLoading = ({
  message = "Inicializando sistema...",
  minLoadingTime = 4000
}) => {
  const classes = useStyles();
  const { darkMode } = useThemeContext();
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const targetText = "WhaTicket";

  useEffect(() => {
    let typewriterTimer;
    let progressTimer;
    let minTimer;

    // Efeito de escrita (typewriter)
    const startTypewriter = () => {
      if (currentIndex < targetText.length) {
        typewriterTimer = setTimeout(() => {
          setDisplayText(targetText.slice(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        }, 300); // Aumentei para 300ms para ser mais visível
      } else if (!isTypingComplete) {
        setIsTypingComplete(true);

        // Após terminar de digitar, iniciar barra de progresso
        progressTimer = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressTimer);
              return 100;
            }
            return prev + 2; // Incrementa 2% a cada 100ms
          });
        }, 100);
      }
    };

    startTypewriter();

    // Timer mínimo para garantir que a animação seja vista
    minTimer = setTimeout(() => {
      // Só permite ocultar após o tempo mínimo
      setShowLoader(false);
    }, minLoadingTime);

    return () => {
      clearTimeout(typewriterTimer);
      clearInterval(progressTimer);
      clearTimeout(minTimer);
    };
  }, [currentIndex, targetText, minLoadingTime, isTypingComplete]);

  // Progresso simulado
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0; // Reinicia o progresso
        }
        return prev + Math.random() * 5;
      });
    }, 300);

    return () => clearInterval(progressInterval);
  }, []);

  // Geração de partículas
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 3,
          duration: 3 + Math.random() * 2
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const particleInterval = setInterval(generateParticles, 5000);

    return () => clearInterval(particleInterval);
  }, []);

  const circuitLines = [
    {
      width: "100px",
      height: "2px",
      top: "40%",
      left: "20%",
      transform: "rotate(0deg)"
    },
    {
      width: "2px",
      height: "80px",
      top: "30%",
      left: "30%",
      transform: "rotate(0deg)"
    },
    {
      width: "150px",
      height: "2px",
      top: "60%",
      right: "20%",
      transform: "rotate(45deg)"
    },
    {
      width: "2px",
      height: "60px",
      top: "50%",
      right: "25%",
      transform: "rotate(0deg)"
    },
    {
      width: "120px",
      height: "2px",
      bottom: "30%",
      left: "15%",
      transform: "rotate(-30deg)"
    },
    {
      width: "2px",
      height: "100px",
      bottom: "20%",
      right: "30%",
      transform: "rotate(0deg)"
    }
  ];

  return (
    <div className={classes.backdrop}>
      {/* Grid de fundo tecnológico */}
      <div className={classes.techGrid} />

      {/* Linhas de circuito */}
      <div className={classes.circuitLines}>
        {circuitLines.map((line, index) => (
          <div key={index} className={classes.circuitLine} style={line} />
        ))}
      </div>

      {/* Partículas flutuantes */}
      <div className={classes.particles}>
        {particles.map(particle => (
          <div
            key={particle.id}
            className={classes.particle}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `particleFloat ${particle.duration}s ease-in-out infinite ${particle.delay}s`
            }}
          />
        ))}
      </div>

      <div className={classes.container}>
        {/* Logo com efeito de escrita */}
        <div className={classes.logoContainer}>
          <div className={classes.typewriter}>{displayText}</div>
        </div>

        {/* Barra de progresso - só aparece após terminar de escrever */}
        {isTypingComplete && (
          <div className={classes.progressContainer}>
            <div className={classes.progressBar}>
              <div
                className={classes.progressFill}
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className={classes.loadingText}>
              {progress < 25 && "Estabelecendo conexão..."}
              {progress >= 25 && progress < 50 && "Carregando módulos..."}
              {progress >= 50 && progress < 75 && "Sincronizando dados..."}
              {progress >= 75 && progress < 100 && "Finalizando..."}
              {progress >= 100 && "Sistema pronto!"}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes particleFloat {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default TechLoading;
