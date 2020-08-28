// All sounds used by de app. SoundManager will preload all of them.
var global_sound_definition = [
    {id:0, src:"assets/snd/wings.mp3"},
    {id:1, src:"assets/snd/die.wav"},
    {id:2, src:"assets/snd/hit.wav"},
    {id:3, src:"assets/snd/eat.wav"},
    {id:4, src:"assets/snd/finish.wav"}
];

// Fonts definition
var global_font_primary_definition = 
{
    fontFile:"font.png",
    fontMap: ".,;:[]=-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ* ?",
    fontPaddingX: 10,
    fontCoords:
    [
        {w:26, x:8       ,y:46    ,h:26}, // .
        {w:26, x:45      ,y:47    ,h:33}, // ,
        {w:29, x:82      ,y:25    ,h:55}, // ;
        {w:29, x:123     ,y:24    ,h:53}, // :
        {w:36, x:163     ,y:8     ,h:79}, // [
        {w:36, x:208     ,y:8     ,h:79}, // ]
        {w:52, x:257     ,y:0     ,h:75}, // =
        {w:30, x:320     ,y:0     ,h:75}, // -
        {w:53, x:362     ,y:10    ,h:66},
        {w:35, x:426     ,y:16    ,h:56},
        {w:46, x:472     ,y:12    ,h:62},
        {w:45, x:529     ,y:11    ,h:65},
        {w:51, x:585     ,y:16    ,h:56},
        {w:45, x:647     ,y:14    ,h:62},
        {w:47, x:702     ,y:13    ,h:63},
        {w:44, x:760     ,y:12    ,h:62},
        {w:47, x:815     ,y:13    ,h:62},
        {w:47, x:873     ,y:14    ,h:60},
        {w:55, x:931     ,y:15    ,h:56},
        {w:47, x:998     ,y:13    ,h:61},
        {w:53, x:1054    ,y:12    ,h:64},
        {w:47, x:1118    ,y:14    ,h:63},
        {w:48, x:1174    ,y:12    ,h:63},
        {w:47, x:1231    ,y:12    ,h:60},
        {w:54, x:1286    ,y:9     ,h:63},
        {w:57, x:1349    ,y:15    ,h:57},
        {w:31, x:1416    ,y:16    ,h:56},
        {w:52, x:1460    ,y:17    ,h:63},
        {w:49, x:1522    ,y:15    ,h:57},
        {w:47, x:1580    ,y:16    ,h:59},
        {w:60, x:1636    ,y:16    ,h:56},
        {w:52, x:1710    ,y:17    ,h:57},
        {w:57, x:1774    ,y:11    ,h:64},
        {w:50, x:1841    ,y:12    ,h:60},
        {w:57, x:1900    ,y:12    ,h:70},
        {w:52, x:1967    ,y:12    ,h:62},
        {w:44, x:2030    ,y:14    ,h:60},
        {w:46, x:2084    ,y:11    ,h:60},
        {w:56, x:2138    ,y:15    ,h:59},
        {w:52, x:2205    ,y:12    ,h:59},
        {w:62, x:2267    ,y:16    ,h:55},
        {w:44, x:2340    ,y:16    ,h:56},
        {w:45, x:2394    ,y:15    ,h:57},
        {w:46, x:2449    ,y:11    ,h:61},
        {w:35, x:2505    ,y:17    ,h:31},
        {w:30, x:2540    ,y:17    ,h:31},
        {w:46, x:2571    ,y:12    ,h:63}
    ]
};

// Joystick constants
Globals.C_BUTTON_SIZE = 20;

Globals.C_BUTTON_RIGHT_KEY = C_KEY_RIGHT;
Globals.C_BUTTON_UP_KEY = C_KEY_UP;
Globals.C_BUTTON_LEFT_KEY = C_KEY_LEFT;
Globals.C_BUTTON_DOWN_KEY = C_KEY_DOWN;

Globals.C_BUTTON_A_KEY = C_KEY_SHIFT;
Globals.C_BUTTON_B_KEY = C_KEY_SHIFT;
Globals.C_BUTTON_C_KEY = C_KEY_SHIFT;



// Font constants
Globals.C_FONT_SIZE_WIDTH = 40;
Globals.C_FONT_SIZE_HEIGHT = 60;

// All bitmaps used by de app. ResourceManager will preload all of them.
var global_bitmap_definition = 
[
    'assets/img/' + global_font_primary_definition.fontFile,

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
    
    'assets/img/cherrytree_fruit_bk.png',
    'assets/img/cherrytree_fruit_fr.png',
    
    'assets/img/cherrytree_branch_someiyoshino.png',
    'assets/img/cherrytree_flower_someiyoshino.png',
    'assets/img/cherrytree_thumb_someiyoshino.png',

    'assets/img/cherrytree_branch_shidarezakura.png',
    'assets/img/cherrytree_flower_shidarezakura.png',
    'assets/img/cherrytree_thumb_shidarezakura.png',

    'assets/img/cherrytree_branch_ukon.png',
    'assets/img/cherrytree_flower_ukon.png',
    'assets/img/cherrytree_thumb_ukon.png',

    'assets/img/log_play.png',
    'assets/img/wood_sign.png',
    'assets/img/callout_keys_help1.png',
    'assets/img/callout_keys_help2.png',
    'assets/img/callout_keys_help3.png',
    'assets/img/callout_keys_help4.png',
    'assets/img/callout_keys_help5.png',
    'assets/img/text_title.png',
    'assets/img/callout_energy_1.png',
    'assets/img/callout_energy_2.png',
    'assets/img/finish_line.png'
];

// This structure is like an image with extra data,
// it has been created only for this game, it is not 
// part of game framework.
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
    scale: 1,
    flip: 1,
    
    collisionRectangle: null,
    
    applyWind: false,
    windAngle: 0,   
    windForce: 0,               // sine function amplitude
    windVelocity: 0,            // sine function frecuency

    energy_change: 0,           // if > 0 ladybug will energy, if < 0 ladybug will be dameged.
    isAWalkingZone: false,
    isFruit: false,
    isBranch: false,
    isFallingFlower: false,
    blinkCounter: 0,
    energyIndicatorX: 0,
    energyIndicatorY: 0,

    angleCounter: 0,
    frecuency: 0,
    amplitude: 0
}

var global_levels_definition =
[
    {   
        id: 0, 
        image: "someiyoshino",  
        name: "SOMEI YOSHINO",  
        info : "Tokyo: early April", 
        fruitProb : 30, 
        fallingFlowerProb : 50, 
        fallingFlowerFrecuency: 2, 
        fallingFlowerEnergy: -3000, 
        branchEnergy: -1500
    },
    
    {
        id: 1, 
        image: "shidarezakura",       
        name: "SHIDAREZAKURA",        
        info : "Tokyo: early April", 
        fruitProb : 20, 
        fallingFlowerProb : 65, 
        fallingFlowerFrecuency: 5, 
        fallingFlowerEnergy: -6000, 
        branchEnergy: -3000
    },
    
    {
        id: 2, 
        image: "ukon",       
        name: "UKON",        
        info : "Tokyo: mid April", 
        fruitProb : 10, 
        fallingFlowerProb : 80, 
        fallingFlowerFrecuency: 10, 
        fallingFlowerEnergy: -9000, 
        branchEnergy: -6000
    }
];

Globals.C_APPLICATION_TITLE_AND_VERSION = 'Ladybug flying test (v1.0.0)';
function Globals() {}
