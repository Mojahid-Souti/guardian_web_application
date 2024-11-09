var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx } from "react/jsx-runtime";
import Particles from "react-tsparticles";
import { loadLinksPreset } from 'tsparticles-preset-links';
const ParticlesBackground = () => {
    const particlesInit = (main) => __awaiter(void 0, void 0, void 0, function* () {
        yield loadLinksPreset(main);
    });
    return (_jsx(Particles, { id: "particles-background", init: particlesInit, options: {
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
        } }));
};
export default ParticlesBackground;
