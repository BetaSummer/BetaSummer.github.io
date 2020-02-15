(function() {
  // 常量
  var MAX_RADIUS = 20;  
  // 数学计算相关
  var PI = Math.PI,
    random = Math.random,
    sin = Math.sin,
    cos = Math.cos;

  // 原型小球
  var ball = {
    color: 'rgba(255, 255, 255, 0.36)',
    radius: 20,
    setColor: function (color) {
      this.color = color;
    },
    setRadius: function (radius) {
      this.radius = radius;
    },
    draw: function (ctx) {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }
  };

  // 画布相关
  var canvas = document.querySelector('#canvas'),
    clientWidth = window.innerWidth,
    clientHeight = window.innerHeight,
    canvasWidth = clientWidth,
    canvasHeight = clientHeight,
    ctx = canvas.getContext('2d'),
    particle = null,
    particles = [];

  // 粒子个数
  var num = (clientWidth/MAX_RADIUS/2) * (clientHeight/MAX_RADIUS/2) * 0.16;
  
  canvas.width = clientWidth;
  canvas.height = clientHeight;
  
  for(var i = 0; i < num; i++) {
    particle = Object.create(ball);
    particle.x = +(random() * canvasWidth).toFixed(2);
    particle.y = +(random() * canvasHeight).toFixed(2);
    particle.radius = +(random() * MAX_RADIUS).toFixed(2);
    particle.angle = +(random() * 360).toFixed(2);
    particles.push(particle);
  }

  /**
   * 达到限制距离连线
   * 
   * @param {Object} ctx 
   * @param {Object} pointA 
   * @param {Object} pointB 
   * @param {Number} limt 
   * @returns 
   */
  function connect (ctx, pointA, pointB, limt) {
    var x = pointA.x - pointB.x,
      y = pointA.y - pointB.y,
      distance = Math.sqrt(x*x + y*y);
    
    if(distance > limt) {
      return ;
    }

    ctx.beginPath();
    ctx.lineWidth = 0.6;
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, '+ (1 - distance/limt) +')';
    ctx.stroke();
    ctx.closePath();
  }

  /**
   * 绘制
   * 
   */
  function run () {
    var speed = 1;

    window.requestAnimationFrame(run);

    // clear 画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    for(var i = 0, len = particles.length; i < len; i++) {
      var j = i + 1;

      while(j < len) {
        connect(ctx, particles[i], particles[j], 120);
        j++;
      }
    }


    particles.forEach(function (particle) {
      var x = particle.x,
        y = particle.y,
        thisAngle = 0;

      if(x > canvasWidth + 2 * MAX_RADIUS || x < -2 * MAX_RADIUS) {
        particle.angle += 90;
      }

      if(y > canvasHeight + 2 * MAX_RADIUS || y < -2 * MAX_RADIUS) {
        particle.angle *= -1;
      }

      thisAngle = particle.angle;

      particle.x += cos(thisAngle * PI / 180) * speed;
      particle.y += sin(thisAngle * PI / 180) * speed;
      particle.draw(ctx);
    });
  }

  run();

  window.addEventListener('resize', function () {
    clientWidth = window.innerWidth;
    clientHeight = window.innerHeight;
    canvasWidth = clientWidth;
    canvasHeight = clientHeight;
    canvas.width = clientWidth;
    canvas.height = clientHeight;
  }, false);
}());