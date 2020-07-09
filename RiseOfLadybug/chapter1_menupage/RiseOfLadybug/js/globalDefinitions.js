// All sounds used by de app. SoundManager will preload all of them.
var global_sound_definition = [
    {src:"assets/snd/wings.mp3", id:0}
];

Globals.C_FONT_NAME = 'font.png';
Globals.C_FONT_SMALL_NAME = 'font.png';
Globals.C_FONT_SIZE_WIDTH = 40;
Globals.C_FONT_SIZE_HEIGHT = 60;
Globals.C_FONT_MAP = "0123456789ae=";

// All bitmaps used by de app. ResourceManager will preload all of them.
var global_bitmap_definition = 
[
    'assets/img/' + Globals.C_FONT_NAME,
    'assets/img/' + Globals.C_FONT_SMALL_NAME,

    'assets/img/ladybug_normal.png',
    'assets/img/ladybug_walk_left.png',
    'assets/img/ladybug_walk_right.png',
    'assets/img/ladybug_open_1.png',
    'assets/img/ladybug_open_2.png',
    'assets/img/ladybug_open_3.png',
    'assets/img/ladybug_flying_1.png',
    'assets/img/ladybug_flying_2.png',
    'assets/img/log.png',
    'assets/img/grass.png',
    'assets/img/cerezo_sakura_branch.png',
    'assets/img/cerezo_sakura_fruit.png',
    'assets/img/log_play.png',
    'assets/img/help_keys.png',
    'assets/img/callout_keys_help1.png',
    'assets/img/callout_keys_help2.png',
    'assets/img/callout_keys_help3.png',
    'assets/img/callout_keys_help4.png',
    'assets/img/callout_keys_help5.png',
    'assets/img/text_title.png'
];

var Sprite =
{
    id: 0,
    canvas: null,
    context: null,
    
    image: null,
    name: "",
    
    x: 0,
    y: 0,
    worldX: 0,
    worldY: 0,
    screenX: 0,
    screenY: 0,
    
    rotation: 0,
    alpha: 1,
    scale: 0.25,
    flip: 1,
    
    collisionRectangle: null,
    
    applyWind: false,
    windAngle: 0,   
    windForce: 0,       // sine function amplitude
    windVelocity: 0,    // sine function frecuency

    energy_change: 0,   // if > 0 ladybug will energy, if < 0 ladybug will be dameged.
    isAWalkingZone: false
}

Globals.C_APPLICATION_TITLE_AND_VERSION = 'Ladybug flying test (v1.0.0)';
function Globals() {}
