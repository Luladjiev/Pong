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
                    return "#" + Math.floor(Math.random() * 16777215).toString(16);
                },
                isColliding = function (pong) {
                    var newPosX = pong.posX + pong.dirX * pong.speed + (pong.dirX > 0 ? pong.size : 0),
                        newPosY = pong.posY + pong.dirY * pong.speed + (pong.dirY > 0 ? pong.size : 0),
                        result = {};

                    result.collideX = newPosX < 0 || newPosX > clientWidth;
                    result.collideY = newPosY < 0 || newPosY > clientHeight;
                    result.colliding = result.collideX || result.collideY;

                    return result;
                },
                placePong = function (pong) {
                    var placed = false;
                    while (placed === false) {
                        pong.posX = Math.random() * (clientWidth - pong.size);
                        pong.posY = Math.random() * (clientHeight - pong.size);
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
                        collision;
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
                        }
                        pong.posX = pong.posX + pong.dirX * pong.speed;
                        pong.posY = pong.posY + pong.dirY * pong.speed;
                    }
                },
                draw = function () {
                    var pong, i = 0,
                        l = pongs.length;
                    for (i; i < l; i += 1) {
                        pong = pongs[i];
                        pong.element.style.left = pong.posX;
                        pong.element.style.top = pong.posY;
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
    Program.run(50);
}());