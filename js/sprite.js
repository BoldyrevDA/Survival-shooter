(function() {
    
//    url: путь к изображению
//    pos: x и y координаты изображения на спрайт карте
//    size: размеры (только одного кадры)
//    speed: скорость анимации в фрейм/с
//    frames: массив индексов фреймов в порядке анимации
//    position: x и y координаты объекта в игре
//    once: true, если необходимо отобразить только один цикл анимации, false — по-умолчанию
    function Sprite(url, pos, size, position, speed, frames, once) {
        this.pos = pos;
        this.size = size;
        this.position =  position || [0,0];
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;;
        this.once = once;
    };
    

    Sprite.prototype = {
        update: function(dt) {
            this._index += this.speed*dt;
            
        },

        render: function(ctx) {
            var frame;

            if(this.speed > 0) {
                var max = this.frames.length;
                if (this.done)
                    {
                        frame = this.frames[max - 1];
                    }
                else
                    {
                        var idx = Math.floor(this._index);
                        frame = this.frames[idx % max];
                    }
                

                if(this.once && idx >= max && !this.done) {
                    this.done = true;
                    this._index = max - 1;
                    frame = this.frames[max - 1];
                    //return;
                }
            }
            else {
                frame = 0;
            }

            var x = this.pos[0];
            var y = this.pos[1];
            
            var posX = this.position[0];
            var posY = this.position[1];
            
            x += frame * this.size[0];
            
            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          posX, posY,
                          this.size[0], this.size[1]);
        }
    };

    window.Sprite = Sprite;
})();