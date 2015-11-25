# phaser-p2Helper

phaser-p2Helper makes it easy to keep track and manage p2.js physics object interactions. It is an advanced helper to keep track on the objects between the onBeginContact and onEndContact signal.

![div](https://raw.github.com/Weedshaker/phaser-p2Helper/master/img/screenShot1_20151125.jpg)

## Features

1. timeObject: Track bodies in real time and/or set delays on add (push) and remove (splice)
2. pushCheckFunctions: Set functions by which criteria the objects get filtered before adding
3. pushEventFunctions: Set functions which are going to be executed when the object gets added
4. spliceEventFunctions: Set functions which are going to be executed when the object gets removed

## Use case explanation

For example, checking for a ground contact: Before writing this helper, I used to achieve this by looping through "game.physics.p2.world.narrowphase.contactEquations", checking for my object having equations with other objects. Then filtering by contact point (yAxis) to distinguish, if it gets touched on "foot".

But doing this on each frame for numerous of objects and criteria has not only turned out to be ugly code but also heavy on performance. I have turned back to the onBeginContact and onEndContact signal, which a p2 body will send out on collision to track those in arrays.
[NOTE: If you tried this and thought that this is not a reliable way, it most likely due to the fact that p2 bodies dispatch the onEndContact signal when a body falls asleep. Make sure to set this.yourEntity.body.allowSleep = false;]
It has turned out a 100% reliable, when avoiding sleep for the tracked body.

## How to use it

First check out "phaser-examples/examples/input/virtual gamecontroller.js"

1. Load &lt;script type=&quot;text/javascript&quot; src=&quot;JavaScript/phaser-p2Helper.js&quot;&gt;&lt;/script&gt;
2. Create a new OnContact object [example name: shapes = new OnContact()]
3. Execute shapes.create() with your preferences
4. Manually add the shapes.pushShape/spliceShape functions to your onBeginContact/onEndContact functions or simply use shapes.attach(this.yourEntity)
5. Keep track on the contacts your object is having by checking shapes.shapeCont.direction.accuracy.length (example: "shapes.shapeCont.bottom.realtime.length")