(function(cvs){
    var width = 1200;
    var height = 720;
    var c = document.getElementById(cvs);
    c.width = width;
    c.height = height;
    var ctx = c.getContext("2d");

    var Field = function(){
        this.activeunits = [];
        this.unitpool = [];
    }

    Field.prototype.step = function(timestep){
        for(var i = this.activeunits.length - 1; i >= 0; i--){
            if(this.activeunits[i].alive){
                this.activeunits[i].step(timestep);
            }
            else{
                this.unitpool.push(this.activeunits[i]);
                this.activeunits.splice(i,1);
            }
        }
    }

    Field.prototype.requestUnit = function(x,y,dx,dy){
        var u;
        if(this.unitpool.length > 0){
            u = this.unitpool.pop();
            u.restart(x,y,dx,dy);
        }
        else{
            u = new FieldUnit(x,y,dx,dy);
        }
        this.activeunits.push(u);
        return u;
    }

    Field.prototype.clean = function(minx,maxx,miny,maxy){
        for(var i = 0; i < this.activeunits.length; i++){
            if(!this.activeunits[i].bound(minx,maxx,miny,maxy)){
                this.activeunits[i].die();
            }
        }
    }

    //Basic unit with position and velocity vectors
    //Used to simulate hidden elements that will be tracked by radar
    var FieldUnit = function(x,y,dx,dy){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.alive = true;
    }

    //Timestep is a fraction of seconds
    FieldUnit.prototype.step = function(timestep){
        this.x += this.dx * timestep;
        this.y += this.dy * timestep;
    }

    //Checks if the unit is inside the rectangle described by
    //the points (minx,miny) and (maxx,maxy)
    //Returns true if the unit is inside that area and false if outside
    FieldUnit.prototype.bound = function(minx,maxx,miny,maxy){
        return this.x < maxx && this.x > minx && this.y < maxy && this.y > miny;
    }

    FieldUnit.prototype.die = function(){
        this.alive = false;
    }

    //Changes the unit parameters to x, y, dx, and dy
    //Sets the unit to alive status
    //The purpose is to allow reusing unit nodes
    FieldUnit.prototype.restart = function(x,y,dx,dy){
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.alive = true;
    }

    var Ping = function(x,y){
        this.x = x;
        this.y = y;
        this.age = 0;
    }

    Ping.prototype.step = function(timestep){
        this.age += timestep;
    }

    var PingZone = function(maxage){
        if(typeof(maxage) === 'undefined'){maxage = 3;}
        this.maxage = maxage;
        this.pings = [];
        this.pingrings = [];
    }

    PingZone.prototype.step = function(timestep){
        for(var i = this.pingrings.length - 1; i >= 0; i--){
            this.pingrings[i].step(timestep);
            if(this.pingrings[i].age > this.maxage){
                this.pingrings.splice(i,1);
            }
        }
    }

    PingZone.prototype.drawPings = function(context){
        context.fillStyle = 'red';
        for(var i = 0; i < this.pings.length; i++){
            var ping = this.pings[i];
            context.beginPath();
            context.arc(ping.x,ping.y,15,0,Math.PI * 2);
            context.fill();
            this.pingrings.push(ping);
        }
        this.pings = [];//Reset pings once they're drawn
    }

    PingZone.prototype.drawRings = function(context){
        context.strokeStyle = 'green';
        for(var i = 0; i < this.pingrings.length; i++){
            var pingring = this.pingrings[i];
            context.beginPath();
            context.arc(pingring.x,pingring.y,pingring.age * 100,0,Math.PI * 2);
            context.stroke();
        }
    }

    PingZone.prototype.spawnPing = function(x,y){
        this.pings.push(new Ping(x,y));
    }

    var RadarUnit = function(x,y,lines,range,linewidth,rotPerSec){
        if(typeof(lines) === 'undefined'){lines = 5;}
        if(typeof(range) === 'undefined'){range = width;}
        if(typeof(linewidth) === 'undefined'){linewidth = 5;}
        if(typeof(rotPerSec) === 'undefined'){rotPerSec = 1 / lines;}
        this.x = x;
        this.y = y;
        this.lines = lines;
        this.range = range;
        this.linewidth = linewidth;
        this.rotPerSec = rotPerSec;
        this.theta = 0;
    }

    RadarUnit.prototype.step = function(timestep){
        this.theta += Math.PI * 2 * timestep * this.rotPerSec;
    }

    RadarUnit.prototype.draw = function(context){
        context.strokeStyle = 'green';
        context.beginPath();
        context.arc(this.x,this.y,15,0,Math.PI * 2);
        context.stroke();
        context.beginPath();
        for(var i = 0, theta = this.theta; i < this.lines; i++, theta += Math.PI * 2 / this.lines){
            context.moveTo(this.x + Math.cos(theta) * 5,this.y + Math.sin(theta) * 5);
            context.lineTo(this.x + Math.cos(theta) * this.range,this.y + Math.sin(theta) * this.range);
        }
        context.stroke();
    }

    //Pass an array of objects with x and y coordinates in the
    //same coordinates space as the radar unit
    //Tests whether each one is within the radar lines and spawns
    //pings from pingzone for each hit
    RadarUnit.prototype.testUnits = function(units,pingzone){
        var linemats = [];
        for(var i = 0, theta = this.theta; i < this.lines; i++, theta += Math.PI * 2 / this.lines){
            linemats.push([Math.sin(theta),Math.cos(theta)]);
        }
        for(var i = 0; i < units.length; i++){
            var unit = units[i];
            for(var j = 0; j < linemats.length; j++){
                var tx = Math.abs((unit.x - this.x) * linemats[j][1] - (unit.y - this.y) * linemats[j][0]);
                var ty = (unit.x - this.x) * linemats[j][0] + (unit.y - this.y) * linemats[j][1];
                if(tx < this.linewidth && ty > 0 && ty < this.range){
                    pingzone.spawnPing(unit.x,unit.y);
                    break;
                }
            }
        }
    }

    var pingzone = new PingZone(1);
    var field = new Field();
    var radarunit = new RadarUnit(width / 2, height / 2,5,width,5,1/3);
    var lasttime = 0;

    function spawn(){
        field.requestUnit(Math.random() * width, Math.random() * height,Math.random() * 100 - 50, Math.random() * 100 - 50);

        setTimeout(spawn,250);
    }

    function wipe(){
        radarctx.fillStyle = 'rgba(0,0,0,0.1)';
        radarctx.fillRect(0,0,width,height);
        setTimeout(wipe,300);
    }

    function stepAndDraw(timestamp){
        var timestep = (timestamp - lasttime) / 1000;
        lasttime = timestamp;

        field.step(timestep);
        radarunit.step(timestep);

        radarunit.testUnits(field.activeunits,pingzone);

        pingzone.step(timestep);

    //    clearRadar();
        pingzone.drawPings(radarctx);
        copyRadar();
        pingzone.drawRings(ctx);
        radarunit.draw(ctx);

        field.clean(0,width,0,height);

        requestAnimationFrame(stepAndDraw);
    }

    function startDraw(timestamp){
        lasttime = timestamp;
        stepAndDraw(timestamp);
    }

    var radarc = document.createElement('canvas');
    radarc.width = width;
    radarc.height = height;
    var radarctx = radarc.getContext("2d");

    function clearRadar(){
        radarctx.fillStyle = 'rgba(0,0,0,0.01)';
        radarctx.fillRect(0,0,width,height);
    }

    function copyRadar(){
        ctx.drawImage(radarc,0,0);
    }

    requestAnimationFrame(startDraw);
    spawn();
    wipe();

}('battlefield'));
