import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { NavLink } from 'react-router-dom';
import LandingScene from './shaders/LandingScene';

const LandingComponent = ({ images = [] }) => {
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredImage, setHoveredImage] = useState(null);

    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [isWrapping, setIsWrapping] = useState(false);


    const handleMouseDown = (e) => {
        if (e.target.tagName.toLowerCase() === 'img') return;
        setIsDragging(true);
        setStartPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) {
            if (velocity.x < 0.1 | velocity.y < 0.1) {
                return
            }
            else {
                const newOffset = {
                    x: offset.x - velocity.x,
                    y: offset.y - velocity.y
                };
                setOffset(newOffset);
            }

        }

        const newOffset = {
            x: e.clientX - startPosition.x,
            y: e.clientY - startPosition.y
        };
        setOffset(newOffset);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setVelocity({ x: 1, y: 1 });
    };

    useEffect(() => {
        const container = containerRef.current;
        container.style.cursor = isDragging ? 'grabbing' : 'grab';



    }, [isDragging]);


    useEffect(() => {
        if (velocity.x > 0.01 | velocity.y > 0.01) {
            setVelocity(prevVelocity => ({ x: prevVelocity.x * 0.1, y: prevVelocity.y * 0.1 }));
            console.log(velocity);
        }

    }, [velocity])

    useEffect(() => {

        const hOffset = 100;
        const wOffset = 100;

        let newOffset = { ...offset };
        let wrapping = false;

        if (offset.y > window.innerHeight) {
            newOffset.y = -window.innerHeight + hOffset;
            wrapping = true;
        } else if (offset.y < -window.innerHeight) {
            newOffset.y = window.innerHeight - hOffset;
            wrapping = true;
        }

        if (offset.x > window.innerWidth) {
            newOffset.x = -window.innerWidth + wOffset;
            wrapping = true;
        } else if (offset.x < -window.innerWidth) {
            newOffset.x = window.innerWidth - wOffset;
            wrapping = true;
        }

        if (wrapping) {
            setIsWrapping(true);
            setOffset(newOffset);
            // Reset wrapping state after a short delay
            setTimeout(() => setIsWrapping(false), 50);
        }

    }, [offset])

    return (
        <>
            <div className="absolute left-1/2 ransform -translate-x-1/2 w-full text-center top-5  z-[900]">
                {/* <img src="./images/Logo.png" className="absolute top-5 left-20 w-[2em]" /> */}
                <p className="text-[5em] inline-block"> Conversations With My Straight Boyfriends </p>
                {/* <p className="text-black text-sm inline-block ">Conversations With My Straight Boyfriends</p> */}
            </div>
            <div
                ref={containerRef}
                className="w-full h-screen overflow-hidden relative"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className="absolute"
                    style={{
                        transform: `translate(${offset.x}px, ${offset.y}px)`,
                        transition: isWrapping ? 'none' : 'transform 0.2s ease-out'
                    }}
                >
                    {images.map((img, index) => (
                        <motion.div
                            whileHover={{ scale: 1.5 }}
                            onHoverStart={e => { }}
                            onHoverEnd={e => { }}
                            key={index}
                            className="absolute"
                            style={{
                                left: img.x,
                                top: img.y,
                                width: img.width,
                                height: img.height
                            }}
                            onMouseEnter={() => setHoveredImage(img)}
                            onMouseLeave={() => setHoveredImage(null)}
                        >
                            <nav>
                                <NavLink
                                    to={img.link}
                                    onClick={(e) => {
                                        if (isDragging) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <img
                                        src={img.src}
                                        alt={img.alt || `Image ${index}`}
                                        className="w-full h-full object-cover"
                                    />
                                </NavLink>
                            </nav>
                            {hoveredImage === img && img.description && (
                                <div className="absolute bottom-0 left-7 right-0 top-4 text-white p-2 text-sm  w-[300px]">
                                    <p className="hitespace-nowrap overflow-hidden text-overflow-ellipsis">
                                        {img.description}
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div >
            <div className="absolute -z-10 top-0">
                <LandingScene />
            </div>
        </>
    );
};

export default LandingComponent;