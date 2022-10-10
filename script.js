window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const contexto = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 500;   

    class InputHandler{
        constructor(game){
            this.game = game;
            window.addEventListener('keydown', e => {
                if(( (e.key == 'ArrowUp') ||
                     (e.key == 'ArrowDown')
                ) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key);
                }else if(e.key === ' '){
                    this.game.player.shootTop();
                }
                console.log(this.game.keys);
            });
            window.addEventListener('keyup', e =>{
                if(this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
                }
                console.log(this.game.keys);
            });
        }
    }
    class Projectile{
        constructor(game, x, y){
            this.game = game;
            this.x = x;
            this.y = y;
            this.width = 10;
            this.height = 3;
            this.speed = 3;
            this.markedForDeletion = false;
        }
        update(){
            this.x += this.speed;
            if(this.x > this.game.width * 0.8) this.markedForDeletion = true;
        }
        draw(context){
            context.fillStyle = 'yellow';
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    class Player{
        constructor(game){
            this.game = game;
            this.width = 120;
            this.height = 190;
            this.x = 20;
            this.y = 100;
            this.speedY = 0;
            this.maxSpeed = 2;
            this.projectiles = []
        }
        update(){
            if(this.game.keys.includes('ArrowUp')) this.speedY = -this.maxSpeed;
            else if (this.game.keys.includes('ArrowDown')) this.speedY = this.maxSpeed;
            else this.speedY = 0;
            this.y += this.speedY;
            // Handle Projectiles
            this.projectiles.forEach(projectile =>{
                projectile.update();
            });
            this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion);
        }
        draw(context){
            context.fillStyle = 'aqua';
            context.fillRect(this.x, this.y, this.width, this.height);
            this.projectiles.forEach(projectile =>{
                projectile.draw(context);
            });
        }
        shootTop(){
            if(this.game.ammo > 0){
                this.projectiles.push(new Projectile(this.game, this.x + 75, this.y));
                this.game.ammo--;
            }
            
        }
    }
    class Enemy{

    }
    class Layer{

    }
    class Background{

    }
    class UI{
        constructor(game){
            this.game = game;
            this.fontSize = 20;
            this.fontFamily = 'Arial';
            this.color = 'yellow';
        }
        draw(context){
            context.fillStyle = this.color;
            for (let i = 0; i < this.game.ammo; i++){
                context.fillRect(20+5 * i, 50, 3, 20)
            }
        }
    }
    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this); 
            this.ui = new UI(this);
            this.keys = [];
            this.ammo = 20;
            this.maxAmmo = 50;
            this.ammoTimer = 0;
            this.ammoInterval = 500;
        }
        update(deltaTime){
            this.player.update();
            if(this.ammoTimer > this.ammoInterval){
                if(this.ammo < this.maxAmmo) this.ammo++;
                this.ammoTimer = 0;
            } else {
                this.ammoTimer += deltaTime;
            }
        }
        draw(context){
            this.player.draw(context);
            this.ui.draw(context);
        } 
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    //Animation loop
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        
        lastTime = timeStamp;
        contexto.clearRect(0,0, canvas.width, canvas.height)
        game.update(deltaTime);
        game.draw(contexto);
        requestAnimationFrame(animate)
    }
    animate(0);
});