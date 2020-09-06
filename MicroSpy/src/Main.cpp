/*
First: thanks to @Javidx9, this was inspired in his youtube tutorials
OneLoneCoder.com - Olc Game Console Engine tutorial @Javidx9

Second : license

Third : about this and me.

License
~~~~~~~
Micro Spy (game for code jam at https://itch.io/jam/olc-codejam-2020 hosted by @Javidx9)
Copyright(C) 2020 mfontanadev.
This program comes with ABSOLUTELY NO WARRANTY.
This is free software, and you are welcome to redistribute it
under certain conditions; See license for details.
Original works located at :
https://github.com/mfontanadev

From mfontanadev :)
~~~~~~~~~~~~~~~
Hello! Use this as like as you want, I hope you can create amazing things
and have a lot of fun.Let me know.You acknowledge
that I am not responsible for anything bad that happens as a result of
your actions.However this code is protected by GNU GPLv3, see the license in the
github repo.This means you must attribute me if you use it.You can view this
license here : https://github.com/mfontanadev/POCs/blob/master/LICENSE
Cheers!

Background
~~~~~~~~~~
Title :
Sources : https ://github.com/mfontanadev/POCs/tree/master/MicroSpy 
Description: you are a micro spy and must scape from micro Daleks to save the  world.

It was made using olcPixelGameEngine from javidx9.
Consuming less than 10 hours in learning olcPixelGameEngine, remembering my C++ old times 
and making the game. 
WARNING: there are a lot of rapid code and non good practices.

Video
~~~~~
PENDING
Author
~~~~~~
site: https://mfontanadev.github.io
twitter: https://twitter.com/mfontanadev
git: https://github.com/mfontanadev
linkedin: https://www.linkedin.com/in/mauricio-fontana-8285681b/?originalSubdomain=ar
Last Updated : 02 / 09 / 2020
*/

#define OLC_PGE_APPLICATION
#include "olcPixelGameEngine.h"

// Constants
constexpr int NORTH = 0;
constexpr int EAST = 1;
constexpr int SOUTH = 2;
constexpr int WEST = 3;
constexpr int PAUSE = 5;

constexpr float FPS = 12;
constexpr float FREC = 1 / FPS;

constexpr int C_STATE_NOT_SET = 0;
constexpr int C_STATE_PLAYING = 1;
constexpr int C_STATE_RESET_LEVEL = 2;
constexpr int C_STATE_NEW_LEVEL = 3;

constexpr int C_MAX_DRONES = 3;
constexpr int C_MAX_GUARD_SPEED = 10;

// Globals
float			acumulatedTime = 0.0;
olc::vf2d		vLevelSize = { 32, 30 };
olc::vf2d		vBlockSize = { 8, 8 };

int				scoreDrons = 0;
int				scoreLevel = 0;

int				state = C_STATE_NOT_SET;
olc::Renderable gfxTiles;
int				guard_speed = C_MAX_GUARD_SPEED;

class MicroSpy : public olc::PixelGameEngine
{
public:
	MicroSpy()
	{
		sAppName = "MicroSpy v1.1.1";
	}

	static int idF(olc::vi2d pos)
	{
		return (int)(pos.y * vLevelSize.x + pos.x);
	}
		
	static std::string levelFactory(int _level)
	{
		std::string retValue = "";
		
		if (_level == 0)
		{
			retValue =
				"................................"
				"................................"
				"/==I==I==I==I==II==I==I==I==I==¬"
				"|..............................|"
				"|.....|.|.===./==./=¬./=¬......|"
				"-.....|=|..|..|...|.|.|.|......-"
				"|.....|.|..=..|...|=/.|.|......|"
				"|.....|.|..|..|...|=..|.|......|"
				"-.....|.|.===.L==.|.|.L=J......-"
				"|..............................|"
				"|........./==./=¬.|.|..........|"
				"-.........|...|.|.|.|..........-"
				"|.........L=¬.|=J.L=J..........|"
				"|...........|.|....|...........|"
				"-.........==J.|....|...........-"
				"|..............................|"
				"|.3...3...3../====¬.3...3...3..|"
				"-..:...:...:.|5...|..:...:...:.-"
				"|............|....|............|"
				"|............L====J............|"
				"-..............................-"
				"|.../==========================|"
				"|...|.P.......................@|"
				"-...L==========================-"
				"|..............................|"
				"|..............................|"
				"L==I==I==I==I==II==I==I==I==I==J"
				"................................"
				"................................"
				"................................";
		}
		else if (_level == 1)
		{
			retValue =
				"................................"
				"................................"
				"/==I==I==I==I==II==I==I==I==I==¬"
				"|..............................|"
				"-..............................-"
				"|..............................|"
				"|.===¬./==./==./=¬./==./=¬.===.|"
				"-..|.|.|...|...|.|.|...|.|..|..-"
				"|..|.L===..|=¬.|=/.|=..|=|..|..|"
				"|..|.|.|...|.|.|:..|...|.|..|..|"
				"-..|.|.L==.L=J.|.|.L==.|.|..|..-"
				"|..............................|"
				"-..............................-"
				"|..............................|"
				"-.|.|./=¬./==.|.|.===./=¬./==..-"
				"|.|=|.|.|.|...|.|..|..|.|.|....|"
				"|.|.|.|=|.|...|=|..|..|.|.|=...|"
				"-.|.|.|.|.|...|.|..|..|.|.|....-"
				"|.|.|.|.|.L==.|.|.===.|.|.L==..|"
				"|..............................|"
				"-.../======================¬...-"
				"|===J...1.......1.......1..L===|"
				"|P..........2.......2.........@|"
				"-==============================-"
				"|..............................|"
				"|..............................|"
				"L==I==I==I==I==II==I==I==I==I==J"
				"................................"
				"................................"
				"................................";
		}
		else if (_level >= 2 && _level <= 3)
		{
			retValue =
				"................................"
				"................................"
				"/==I==I==I==I==II==I==I==I==I==¬"
				"|.............|@|..1.1.1.1.....|"
				"-.2.2.2.2.2.2.|.|.1.1.1.1.1.1..-"
				"|.2.2.2.2.2.2.|.|..1.......1...|"
				"|.2.2.2.2.2.2.|.|.1...1.1...1..|"
				"-.2.2.2.2.2.2......1.1.1.1.1...-"
				"|.2.2.2.2.2.2.|.|..............|"
				"|=.=============/=============.|"
				"-6............|.|............|.-"
				"|./=========¬...|././========J.|"
				"-.|.........|.|.|.|.|...|...|..-"
				"|6L=========J.|.|.|.L.|.|.|.L=.|"
				"-..6...6...6..|...|...|...|....-"
				"|====I====I====.====I====I====.|"
				"|............1.................|"
				"-...2..2..2....|.==============-"
				"|.L============¬...............|"
				"|.....1....1...|.:..:..:..:..:.|"
				"-..2.....2....2|..4..4..4..4..4-"
				"|=I==I=¬==I==J.L==I==¬===I==I.=|"
				"|P.....|.......3.....|..|..|...|"
				"-=====.|.2..2|..:.3..|..|6.|...-"
				"|......|.....-.....:.|6....|6..|"
				"|........2..2|..........|......|"
				"L==I==I==I==I==II==I==I==I==I==J"
				"................................"
				"................................"
				"................................";
		}
		else
		{
			retValue =
				"................................"
				"................................"
				"................................"
				"................................"
				"................................"
				"................................"
				"................................"
				"..........T..TAT..ATT..........."
				".........TTTAA..ATT..AT........."
				"......ATAT.......T.....A........"
				"......AT...T..AT........A......."
				".....A......T...T..T..T..T......"
				".....AT..ATT.....AT...T..T......"
				"......T....T...T...AT..TA......."
				"......ATT......T.....ATT........"
				"........AT.......ATATA.........."
				"..........TATTA.T..............."
				".............TT.A..............."
				"..............A.T..............."
				"..............T.A..............."
				"..............A.T..............."
				"..............T.A..............."
				"..............A.T..............."
				"..............T.A..............."
				"..............A.T..............."
				"..............TPA..............."
				"..............AAA..............."
				"................................"
				"................................"
				"................................";
		}

		return retValue;
	}
			   
	struct block
	{
		block()
		{
			visited = false;
			gfxTilePos = { 0, 0 };
		}

		virtual void DrawSelf(olc::PixelGameEngine* pge, const olc::vi2d& pos, const olc::vi2d& size, const olc::Renderable& skin)
		{

		}

		virtual bool Push(const int from)
		{
			return true;
		}

		virtual void ImplementGameLogic(std::vector<std::unique_ptr<block>>& _vLevel, olc::vi2d& pos, int dir)
		{

		}

		virtual bool IsExit()
		{
			return false;
		}

		virtual bool Damage()
		{
			return false;
		}

		virtual bool PlayerCaptured()
		{
			return false;
		}

		virtual void Move(std::vector<std::unique_ptr<block>>& _vLevel, olc::vi2d& pos, int dir)
		{
		}

		bool		visited = false;
		olc::vi2d	gfxTilePos = { 0, 0 };
	};

	struct block_solid : public block
	{
		block_solid(const olc::vi2d& _imagePos)
		{
			gfxTilePos = _imagePos;
		}

		void DrawSelf(olc::PixelGameEngine* pge, const olc::vi2d& pos, const olc::vi2d& size, const olc::Renderable& skin) override
		{
			pge->DrawPartialSprite(pos * size, skin.Sprite(), gfxTilePos * size, size);
		}

		bool Push(const int from) override
		{
			return false;
		}
	};

	struct block_goal : public block
	{
		block_goal(const olc::vi2d& _imagePos)
		{
			gfxTilePos = _imagePos;
		}

		void DrawSelf(olc::PixelGameEngine* pge, const olc::vi2d& pos, const olc::vi2d& size, const olc::Renderable& skin) override
		{
			pge->DrawPartialSprite(pos * size, skin.Sprite(), gfxTilePos * size, size);
		}

		bool Push(const int from) override
		{
			return false;
		}

		bool IsExit() override
		{
			return true;
		}
	};

	struct block_player : public block
	{
		block_player(const olc::vi2d& _imagePos)
		{
			gfxTilePos = _imagePos;
		}

		void DrawSelf(olc::PixelGameEngine* pge, const olc::vi2d& pos, const olc::vi2d& size, const olc::Renderable& skin) override
		{
			pge->DrawPartialSprite(pos * size, skin.Sprite(), gfxTilePos * size, size);
		}

		bool Push(const int from) override
		{
			return true;
		}

		void ImplementGameLogic(std::vector<std::unique_ptr<block>>& _vLevel, olc::vi2d& pos, int dir) override
		{
			Move(_vLevel, pos, dir);
			int a = 1;
		}

		void Move(std::vector<std::unique_ptr<block>>& _vLevel, olc::vi2d& pos, int dir) override
		{
			olc::vi2d vTarget = pos;

			switch (dir)
			{
			case NORTH: vTarget.y--; break;
			case SOUTH: vTarget.y++; break;
			case EAST: vTarget.x++; break;
			case WEST: vTarget.x--; break;
			}

			if (_vLevel[idF(vTarget)] == nullptr)
			{
				std::swap(_vLevel[idF(vTarget)], _vLevel[idF(pos)]);
				pos = vTarget;
			}
			else
			{
				if (_vLevel[idF(vTarget)]->IsExit())
				{
					_vLevel[idF(vTarget)] = nullptr;
					std::swap(_vLevel[idF(vTarget)], _vLevel[idF(pos)]);
					state = C_STATE_NEW_LEVEL;
					scoreLevel++;
					pos = vTarget;
				}
				else if (_vLevel[idF(vTarget)]->Damage())
				{
					_vLevel[idF(vTarget)] = nullptr;
					std::swap(_vLevel[idF(vTarget)], _vLevel[idF(pos)]);
					state = C_STATE_RESET_LEVEL;

					if (scoreLevel > 1)
						scoreDrons--;
					pos = vTarget;
				}
			}
		}

		bool PlayerCaptured() override
		{
			return true;
		}
	};

	struct block_guard : public block
	{
		block_guard(std::string _path, const olc::vi2d& _imagePos)
		{
			path = _path;
			gfxTilePos = _imagePos;
		}

		void DrawSelf(olc::PixelGameEngine* pge, const olc::vi2d& pos, const olc::vi2d& size, const olc::Renderable& skin) override
		{
			pge->DrawPartialSprite(pos * size, skin.Sprite(), gfxTilePos * size, size);
		}

		bool Push(const int from) override
		{
			return true;
		}

		void ImplementGameLogic(std::vector<std::unique_ptr<block>>& _vLevel, olc::vi2d& pos, int dir) override
		{
			bool bNextPathIndex = true;
			if (sleepCounter >= guard_speed)
				sleepCounter = 0;

			if (sleepCounter == 0)
			{
				switch (path[pathIndex])
				{
					case '.': nCurrentDir = PAUSE; break;

					case 'W': nCurrentDir = NORTH; break;
					case 'S': nCurrentDir = SOUTH; break;
					case 'D': nCurrentDir = EAST; break;
					case 'A': nCurrentDir = WEST; break;
					
					case 'w': nCurrentDir = NORTH; bNextPathIndex = false; break;
					case 's': nCurrentDir = SOUTH; bNextPathIndex = false; break;
					case 'd': nCurrentDir = EAST; bNextPathIndex = false; break;
					case 'a': nCurrentDir = WEST; bNextPathIndex = false; break;
				}

				if (nCurrentDir != PAUSE)
				{
					olc::vi2d vTarget = pos;
					Move(_vLevel, pos, nCurrentDir);

					if (vTarget == pos)
					{
						bNextPathIndex = true;
					}
				}

				if (bNextPathIndex)
				{
					pathIndex++;
					if (pathIndex >= (int)path.length())
						pathIndex = 0;
				}
			}

			sleepCounter++;
		}
		
		// Guard blocks has special movement logic.
		// You can define (like finite state machine) a sequence of chars to make block move.
		// It is processed one char at time.
		// Example: WWAA means move twice UP and twice right.
		void Move(std::vector<std::unique_ptr<block>>& _vLevel, olc::vi2d& pos, int dir) override
		{
			olc::vi2d vTarget = pos;

			switch (dir)
			{
				case NORTH: vTarget.y--; break;
				case SOUTH: vTarget.y++; break;
				case EAST: vTarget.x++; break;
				case WEST: vTarget.x--; break;
			}

			if (_vLevel[idF(vTarget)] == nullptr)
			{
				std::swap(_vLevel[idF(vTarget)], _vLevel[idF(pos)]);
			}
			else
			{
				if (_vLevel[idF(vTarget)]->PlayerCaptured())
				{
					_vLevel[idF(vTarget)] = nullptr;
					std::swap(_vLevel[idF(vTarget)], _vLevel[idF(pos)]);

					scoreDrons--;
					state = C_STATE_RESET_LEVEL;
				}
			}
		}

		bool Damage() override
		{
			return true;
		}

		int nCurrentDir = 0;
		std::string path = "";
		int pathIndex = 0;
		int sleepCounter = 0;
	};


	olc::vi2d	vPlayer;
	bool		bPlayerMoving = false;
	int			iPlayerDir = 0;

	std::vector<std::unique_ptr<block>> vLevel;

public:
	void LoadLevel(int n, bool bNewLevel)
	{ 

		vLevel.clear();

		std::string sLevel = levelFactory(n);
		
		// Change level definition to add random guards.
		/*
		if (scoreLevel >= 2)
		{
			std::string guards = "123456";
			for (int y = 0; y < vLevelSize.y; y++)
			{
				for (int x = 0; x < vLevelSize.x; x++)
				{
					if (sLevel[y * vLevelSize.x + x] == '?')
					{
						sLevel[y * vLevelSize.x + x] = guards[rand() % (guards.length() - 1)];
					}
				}
			}
		}*/

		// Increment difficulty, only if level changes.
		if (bNewLevel == true)
		{
			if (scoreLevel == 3)
			{
					guard_speed = guard_speed - 5;
			}
		}

		for (int y = 0; y < vLevelSize.y; y++)
		{
			for (int x = 0; x < vLevelSize.x; x++)
			{
				switch (sLevel[(int)(y * vLevelSize.x + x)])
				{
					case '/': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(9, 1))); break;
					case '=': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(4, 1))); break;
					case 'I': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(5, 1))); break;
					case '¬': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(6, 1))); break;
					case '|': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(2, 1))); break;
					case 'L': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(8, 1))); break;
					case 'J': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(7, 1))); break;
					case '-': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(3, 1))); break;
					case ':': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(10,1))); break;
					case 'O': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(11,1))); break;

					case 'P':
						vLevel.emplace_back(std::make_unique<block_player>(olc::vi2d(0, 1)));
						vPlayer = { x, y };
						break;

					case '1': vLevel.emplace_back(std::make_unique<block_guard>("DSAW", olc::vi2d(1, 0))); break;
					case '2': vLevel.emplace_back(std::make_unique<block_guard>("AWDS", olc::vi2d(2, 0))); break;
					case '3': vLevel.emplace_back(std::make_unique<block_guard>("DDSSAAWW", olc::vi2d(3, 0))); break;
					case '4': vLevel.emplace_back(std::make_unique<block_guard>("AAWWDDSS", olc::vi2d(4, 0))); break;
					case '5': vLevel.emplace_back(std::make_unique<block_guard>("dsaw", olc::vi2d(5, 0))); break;
					case '6': vLevel.emplace_back(std::make_unique<block_guard>("awds", olc::vi2d(6, 0))); break;
					case 'T': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(7, 0))); break;
					case 'A': vLevel.emplace_back(std::make_unique<block_solid>(olc::vi2d(8, 0))); break;

					case '@': vLevel.emplace_back(std::make_unique<block_goal>(olc::vi2d(1, 1))); break;
					case '?': 
					{
						vLevel.emplace_back(std::make_unique<block_goal>(olc::vi2d(1, 1))); 
						
						break;

					}

					default:
					{
						vLevel.emplace_back(nullptr);
					}
				}
			}

		
		}
	}

	// One game initialization.
	bool OnUserCreate() override
	{
		srand(0xF451);

		gfxTiles.Load("./img/blocks.png");
	
		resetGame();
		
		return true;
	}

	// Game loop.
	bool OnUserUpdate(float fElapsedTime) override
	{
		acumulatedTime += fElapsedTime;

		handleInputs();

		// Wait FREC pulse to perform game logic.
		if (acumulatedTime >= FREC)
		{
			acumulatedTime = 0;
			implementGameLogic();
		}

		// Render as fast as it can.
		render();

		return true;
	}

	void handleInputs()
	{
		if (GetKey(olc::Key::UP).bPressed || GetKey(olc::Key::W).bPressed)
		{
			iPlayerDir = NORTH;
			bPlayerMoving = true;
		}

		if (GetKey(olc::Key::DOWN).bPressed || GetKey(olc::Key::S).bPressed)
		{
			iPlayerDir = SOUTH;
			bPlayerMoving = true;
		}

		if (GetKey(olc::Key::LEFT).bPressed || GetKey(olc::Key::A).bPressed)
		{
			iPlayerDir = WEST;
			bPlayerMoving = true;
		}

		if (GetKey(olc::Key::RIGHT).bPressed || GetKey(olc::Key::D).bPressed)
		{
			iPlayerDir = EAST;
			bPlayerMoving = true;
		}
	}

	void implementGameLogic()
	{
		// Perform player logic
		if (bPlayerMoving)
		{
			auto& playerBlock = vLevel[idF(vPlayer)];

			if (playerBlock)
			{
				playerBlock->ImplementGameLogic(vLevel, vPlayer, iPlayerDir);
			}
		}

		// Perform implmementGameLogic for each block.
		olc::vi2d vTilePos = { 0,0 };
		for (vTilePos.y = 0; vTilePos.y < vLevelSize.y; vTilePos.y++)
		{
			for (vTilePos.x = 0; vTilePos.x < vLevelSize.x; vTilePos.x++)
			{
				auto& b = vLevel[idF(vTilePos)];

				if (b && b->visited == false)
				{
					if (vTilePos != vPlayer)
					{
						b->visited = true;
						b->ImplementGameLogic(vLevel, vTilePos, 0);
					}
				}
			}
		}
		
		// Clear blocks's visited flag.
		for (vTilePos.y = 0; vTilePos.y < vLevelSize.y; vTilePos.y++)
		{
			for (vTilePos.x = 0; vTilePos.x < vLevelSize.x; vTilePos.x++)
			{
				auto& b = vLevel[idF(vTilePos)];

				if (b)
					b->visited = false;
			}
		}

		if (scoreDrons <= 0)
		{
			resetGame();
		}

		if (state == C_STATE_RESET_LEVEL || state == C_STATE_NEW_LEVEL)
		{
			LoadLevel(scoreLevel, (state == C_STATE_NEW_LEVEL));
			state = C_STATE_PLAYING;
		}

		iPlayerDir = 0;
		bPlayerMoving = false;
	}

	void resetGame()
	{
		scoreLevel = 0;
		scoreDrons = C_MAX_DRONES;
		state = C_STATE_PLAYING;
		guard_speed = C_MAX_GUARD_SPEED;

		LoadLevel(scoreLevel, false);
	}

	void render()
	{
		Clear(olc::BLACK);

		olc::vi2d vTilePos = { 0,0 };
		for (vTilePos.y = 0; vTilePos.y < vLevelSize.y; vTilePos.y++)
		{
			for (vTilePos.x = 0; vTilePos.x < vLevelSize.x; vTilePos.x++)
			{
				auto& b = vLevel[idF(vTilePos)];

				if (b)
				{
					b->DrawSelf(this, vTilePos, vBlockSize, gfxTiles);
				}
			}
		}

		if (scoreLevel == 0)
		{
			DrawString(4, 4, "Use ARROWS. Avoid micro Daleks.");
		}
		else if (scoreLevel == 1)
		{
			DrawString(4, 4, "Finish mission, save the world.");
		}
		else if (scoreLevel == 4)
		{
			DrawString(4, 4, "Congrats. The world is safe.");
		}
		else
		{
			DrawString(4, 4, "Drons: " + std::to_string(scoreDrons) + "   Level:" + std::to_string(scoreLevel - 2), olc::WHITE);
		}
	}

};


int main()
{
	MicroSpy demo;
	if (demo.Construct(256, 240, 3, 3))
		demo.Start();
	return 0;
}