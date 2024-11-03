import React from 'react';
import Particles from "react-tsparticles";
import { loadLinksPreset } from 'tsparticles-preset-links';

const ParticlesBackground: React.FC = () => {
     const particlesInit = async (main: any) => {
          await loadLinksPreset(main);
     };

     return (
          <Particles
               id="particles-background"
               init={particlesInit}
               options={{
                    background: {
                         color: {
                              value: "#ffffff", // White background
                         },
                    },
                    particles: {
                         color: {
                              value: "#FFD700", // Gold particles
                         },
                         links: {
                              color: "#FFD700", // Gold connections
                              distance: 150,
                              enable: true,
                              opacity: 0.5,
                              width: 1,
                         },
                         move: {
                              enable: true,
                              speed: 2,
                         },
                         number: {
                              density: {
                                   enable: true,
                                   area: 800,
                              },
                              value: 80,
                         },
                         opacity: {
                              value: 0.7,
                         },
                         size: {
                              value: { min: 1, max: 3 },
                         },
                    },
                    detectRetina: true,
                    preset: "links",
               }}
          />
     );
};

export default ParticlesBackground;