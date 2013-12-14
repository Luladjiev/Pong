/*global document, console, requestAnimationFrame, cancelAnimationFrame*/
(function () {
    'use strict';

    var Program,
        Pong = function (clientWidth, clientHeight) {
            var fps = 60,
                gameId = null,
                pongs = [],
                pongId = 0,
                getRandomColor = function () {
                    var color = '#ffffff';
                    while (color === '#ffffff') {
                        color = '#' + Math.floor(Math.random() * 16777215).toString(16);
                    }
                    return color;
                },
                areColliding = function (pongA, pongB) {
                    return (Math.abs(pongA.x - pongB.x) * 2 < pongA.size + pongB.size) && (Math.abs(pongA.y - pongB.y) * 2 < pongA.size + pongB.size);
                },
                isColliding = function (pong) {
                    var newPosX = pong.x + pong.dirX * pong.speed + (pong.dirX > 0 ? pong.size : 0),
                        newPosY = pong.y + pong.dirY * pong.speed + (pong.dirY > 0 ? pong.size : 0),
                        result = {
                            collideX: false,
                            collideY: false,
                            collidePong: false
                        },
                        i = 0,
                        l = pongs.length,
                        otherPong,
                        collision;

                    result.collideX = newPosX < 0 || newPosX > clientWidth;
                    result.collideY = newPosY < 0 || newPosY > clientHeight;

                    for (i; i < l; i += 1) {
                        otherPong = pongs[i];
                        if (pong.id !== otherPong.id) {
                            if (areColliding(pong, otherPong) === true) {
                                result.collidePong = true;
                                result.otherPong = otherPong;
                            }
                        }
                    }
                    
                    result.colliding = result.collideX || result.collideY || result.collidePong;

                    return result;
                },
                placePong = function (pong) {
                    var placed = false;
                    while (placed === false) {
                        pong.x = Math.random() * (clientWidth - pong.size);
                        pong.y = Math.random() * (clientHeight - pong.size);
                        if (isColliding(pong).colliding === false) {
                            placed = true;
                        }
                    }
                },
                createPong = function () {
                    var blockSize = 50,
                        element = document.createElement('span'),
                        pong;

                    element.style.position = 'absolute';
                    element.style.display = 'block';
                    element.style.width = blockSize + 'px';
                    element.style.height = blockSize + 'px';
                    element.style.background = getRandomColor();

                    pong = {
                        id: pongId += 1,
                        element: element,
                        size: blockSize,
                        dirX: Math.random() > 0.5 ? 1 : -1,
                        dirY: Math.random() > 0.5 ? 1 : -1,
                        speed: Math.random() + 5
                    };

                    placePong(pong);

                    return pong;
                },
                update = function () {
                    var pong, i = 0,
                        j = 0,
                        l = pongs.length,
                        collision, speed;
                    for (i; i < l; i += 1) {
                        pong = pongs[i];
                        collision = isColliding(pong);
                        if (collision.colliding) {
                            if (collision.collideX === true) {
                                pong.dirX = pong.dirX * -1;
                            }
                            if (collision.collideY === true) {
                                pong.dirY = pong.dirY * -1;
                            }
                            if (collision.collidePong === true) {
                                if ((pong.dirX < 0 && collision.otherPong.dirX > 0) || (pong.dirX > 0 && collision.otherPong.dirX < 0)) {
                                    pong.dirX = pong.dirX * -1;
                                    collision.otherPong.dirX = collision.otherPong.dirX * -1;
                                }
                                if ((pong.dirY < 0 && collision.otherPong.dirY > 0) || (pong.dirY > 0 && collision.otherPong.dirY < 0)) {
                                    pong.dirY = pong.dirY * -1;
                                    collision.otherPong.dirY = collision.otherPong.dirY * -1;
                                }
                                speed = pong.speed;
                                pong.speed = collision.otherPong.speed;
                                collision.otherPong.speed = speed;
                            }
                        }
                        pong.x = pong.x + pong.dirX * pong.speed;
                        pong.y = pong.y + pong.dirY * pong.speed;
                    }
                },
                draw = function () {
                    var pong, i = 0,
                        l = pongs.length;
                    for (i; i < l; i += 1) {
                        pong = pongs[i];
                        pong.element.style.left = pong.x;
                        pong.element.style.top = pong.y;
                    }
                },
                loop = function () {
                    update();
                    draw();
                    gameId = requestAnimationFrame(loop);
                },
                run = function (numberOfPongs) {
                    var i = 0,
                        pong;
                    for (i = 0; i < numberOfPongs; i += 1) {
                        pong = createPong();
                        document.body.appendChild(pong.element);
                        pongs.push(pong);
                    }
                    gameId = requestAnimationFrame(loop);
                },
                stop = function () {
                    cancelAnimationFrame(gameId);
                    console.log('End');
                };

            return {
                run: run,
                stop: stop
            };
        };
    Program = new Pong(document.documentElement.clientWidth, document.documentElement.clientHeight);
    Program.run(30);
}());