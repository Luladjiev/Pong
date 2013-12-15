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
                    while (color.length < 7) {
                        color += 'f';
                    }
                    return color;
                },
                areColliding = function (pongA, pongB) {
                    var buffer = 2,
                        aS = (pongA.size / 2),
                        bS = (pongB.size / 2),
                        aX = pongA.x + aS,
                        aY = pongA.y + aS,
                        bX = pongB.x + bS,
                        bY = pongB.y + bS,
                        dX,
                        dY;

                    dX = Math.abs(aX - bX);
                    dY = Math.abs(aY - bY);

                    return Math.sqrt(dX * dX + dY * dY) <= aS + bS + buffer;
                },
                isColliding = function (pong) {
                    var newPosX = pong.x + pong.dirX * pong.speed + (pong.dirX > 0 ? pong.size : 0),
                        newPosY = pong.y + pong.dirY * pong.speed + (pong.dirY > 0 ? pong.size : 0),
                        buffer = 10,
                        result = {
                            collideX: false,
                            collideY: false,
                            collidePong: false
                        },
                        i = 0,
                        l = pongs.length,
                        otherPong,
                        collision;

                    result.collideLeft = newPosX - buffer < 0;
                    result.collideRight = newPosX + buffer > clientWidth;
                    result.collideTop = newPosY - buffer < 0;
                    result.collideBottom = newPosY + buffer > clientHeight;

                    for (i; i < l; i += 1) {
                        otherPong = pongs[i];
                        if (pong.id !== otherPong.id) {
                            if (areColliding(pong, otherPong) === true) {
                                result.collidePong = true;
                                result.otherPong = otherPong;
                            }
                        }
                    }

                    result.colliding = result.collideLeft || result.collideRight || result.collideTop || result.collideBottom || result.collidePong;

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
                    element.style.borderRadius = blockSize + 'px';

                    pong = {
                        id: pongId += 1,
                        element: element,
                        size: blockSize,
                        dirX: Math.random() > 0.5 ? 1 : -1,
                        dirY: Math.random() > 0.5 ? 1 : -1,
                        speed: 5,
                        collided: false
                    };

                    placePong(pong);

                    return pong;
                },
                collision = function (pong) {
                    var speed, collision = isColliding(pong);
                    if (collision.colliding) {
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
                        if (collision.collideLeft === true || collision.collideRight === true) {
                            if (collision.collideLeft === true && pong.dirX === -1) {
                                pong.dirX = 1;
                            }
                            if (collision.collideRight === true && pong.dirX === 1) {
                                pong.dirX = -1;
                            }
                        }
                        if (collision.collideTop === true || collision.collideBottom === true) {
                            if (collision.collideTop === true && pong.dirY === -1) {
                                pong.dirY = 1;
                            }
                            if (collision.collideBottom === true && pong.dirY === 1) {
                                pong.dirY = -1;
                            }
                        }
                    }
                    return pong;
                },
                update = function () {
                    var pong, i = 0,
                        j = 0,
                        l = pongs.length;
                    for (i; i < l; i += 1) {
                        pong = pongs[i];
                        pong = collision(pong);
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