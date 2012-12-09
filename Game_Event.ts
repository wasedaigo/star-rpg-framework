/// <reference path='../../underscore.d.ts' />
/// <reference path='../game/ebi.ts' />
/// <reference path='./datamanager.ts' />

//==============================================================================
// ■ gameEvent
//------------------------------------------------------------------------------
// 　イベントを扱うクラスです。条件判定によるイベントページ切り替えや、並列処理
// イベント実行などの機能を持っており、gameMap クラスの内部で使用されます。
//==============================================================================

module ebi {

    export module rpg {
        class gameEvent extends gameCharacter {
            //--------------------------------------------------------------------------
            // ● private変数
            //--------------------------------------------------------------------------
            private mapid: number;
            private event: any;
            private id: number;
            private erased: bool;
            private page: number;

            private trigger: number;                // トリガー
            private list: any[];                    // 実行内容
            private starting: bool;                 // 起動中フラグ

            //--------------------------------------------------------------------------
            // ● 公開インスタンス変数
            //--------------------------------------------------------------------------
            public get trigger(): number { return this.trigger; }
            public get list(): any[] { return this.list; }
            public get starting(): bool { return this.starting; }

            //--------------------------------------------------------------------------
            // ● オブジェクト初期化
            //     event : rpg::event
            //--------------------------------------------------------------------------
            constructor(mapid: number, event: any) {
                super();
                this.mapid = mapid;
                this.event = event;
                this.id = this.event.id;
                this.moveto(this.event.x, this.event.y);
                this.refresh();
            }
            //--------------------------------------------------------------------------
            // ● 公開メンバ変数の初期化
            //--------------------------------------------------------------------------
            public initPublicMembers
            super
            @trigger = 0
            @list = nil
            @starting = false
            }
            //--------------------------------------------------------------------------
            // ● 非公開メンバ変数の初期化
            //--------------------------------------------------------------------------
            public initPrivateMembers
            super
            @moveType = 0                        // 移動タイプ
            this.erased = false                       // 一時消去フラグ
            this.page = nil                           // イベントページ
            }
            //--------------------------------------------------------------------------
            // ● キャラクターとの衝突判定
            //--------------------------------------------------------------------------
            public collideWithCharacters?(x, y)
            super || collideWithPlayerCharacters?(x, y)
            }
            //--------------------------------------------------------------------------
            // ● プレイヤーとの衝突判定（フォロワーを含む）
            //--------------------------------------------------------------------------
            public collideWithPlayerCharacters?(x, y)
            normalPriority? && $gamePlayer.collide?(x, y)
            }
            //--------------------------------------------------------------------------
            // ● ロック（実行中のイベントが立ち止まる処理）
            //--------------------------------------------------------------------------
            public lock
            unless @locked
              @prelockDirection = @direction
              turnTowardPlayer
              @locked = true
            }
            }
            //--------------------------------------------------------------------------
            // ● ロック解除
            //--------------------------------------------------------------------------
            public unlock
            if @locked
              @locked = false
              setDirection(@prelockDirection)
            }
            }
            //--------------------------------------------------------------------------
            // ● 停止時の更新
            //--------------------------------------------------------------------------
            public updateStop
            super
            updateSelfMovement unless @moveRouteForcing
            }
            //--------------------------------------------------------------------------
            // ● 自律移動の更新
            //--------------------------------------------------------------------------
            public updateSelfMovement
            if nearTheScreen? && @stopCount > stopCountThreshold
              case @moveType
              when 1;  moveTypeRandom
              when 2;  moveTypeTowardPlayer
              when 3;  moveTypeCustom
              }
            }
            }
            //--------------------------------------------------------------------------
            // ● 画面の可視領域付近にいるか判定
            //     dx : 画面中央から左右何マス以内を判定するか
            //     dy : 画面中央から上下何マス以内を判定するか
            //--------------------------------------------------------------------------
            public nearTheScreen?(dx = 12, dy = 8)
            ax = $gameMap.adjustX(@realX) - graphics.width / 2 / 32
            ay = $gameMap.adjustY(@realY) - graphics.height / 2 / 32
            ax >= -dx && ax <= dx && ay >= -dy && ay <= dy
            }
            //--------------------------------------------------------------------------
            // ● 自律移動を開始する停止カウントの閾値を計算
            //--------------------------------------------------------------------------
            public stopCountThreshold
            30 * (5 - @moveFrequency)
            }
            //--------------------------------------------------------------------------
            // ● 移動タイプ : ランダム
            //--------------------------------------------------------------------------
            public moveTypeRandom
            case rand(6)
            when 0..1;  moveRandom
            when 2..4;  moveForward
            when 5;     @stopCount = 0
            }
            }
            //--------------------------------------------------------------------------
            // ● 移動タイプ : 近づく
            //--------------------------------------------------------------------------
            public moveTypeTowardPlayer
            if nearThePlayer?
              case rand(6)
              when 0..3;  moveTowardPlayer
              when 4;     moveRandom
              when 5;     moveForward
              }
            else
              moveRandom
            }
            }
            //--------------------------------------------------------------------------
            // ● プレイヤーの近くにいるか判定
            //--------------------------------------------------------------------------
            public nearThePlayer?
            sx = distanceXFrom($gamePlayer.x).abs
            sy = distanceYFrom($gamePlayer.y).abs
            sx + sy < 20
            }
            //--------------------------------------------------------------------------
            // ● 移動タイプ : カスタム
            //--------------------------------------------------------------------------
            public moveTypeCustom
            updateRoutineMove
            }
            //--------------------------------------------------------------------------
            // ● 起動中フラグのクリア
            //--------------------------------------------------------------------------
            public clearStartingFlag
            @starting = false
            }
            //--------------------------------------------------------------------------
            // ● 実行内容が空か否かを判定
            //--------------------------------------------------------------------------
            public empty?
            !@list || @list.size <= 1
            }
            //--------------------------------------------------------------------------
            // ● 指定されたトリガーのいずれかか否かを判定
            //     triggers : トリガーの配列
            //--------------------------------------------------------------------------
            public triggerIn?(triggers)
            triggers.include?(@trigger)
            }
            //--------------------------------------------------------------------------
            // ● イベント起動
            //--------------------------------------------------------------------------
            public start
            return if empty?
            @starting = true
            lock if triggerIn?([0,1,2])
            }
            //--------------------------------------------------------------------------
            // ● 一時消去
            //--------------------------------------------------------------------------
            public erase
                this.erased = true
                this.refresh();
            }
            //--------------------------------------------------------------------------
            // ● リフレッシュ
            //--------------------------------------------------------------------------
            public refresh
            newPage = this.erased ? nil : findProperPage
            setupPage(newPage) if !newPage || newPage != this.page
            }
            //--------------------------------------------------------------------------
            // ● 条件に合うイベントページを見つける
            //--------------------------------------------------------------------------
            public findProperPage
            this.event.pages.reverse.find {|page| conditionsMet?(page) }
            }
            //--------------------------------------------------------------------------
            // ● イベントページの条件合致判定
            //--------------------------------------------------------------------------
            public conditionsMet?(page)
            c = page.condition
            if c.switch1Valid
              return false unless $gameSwitches[c.switch1Id]
            }
            if c.switch2Valid
              return false unless $gameSwitches[c.switch2Id]
            }
            if c.variableValid
              return false if $gameVariables[c.variableId] < c.variableValue
            }
            if c.selfSwitchValid
              key = [this.mapid, this.event.id, c.selfSwitchCh]
              return false if $gameSelfSwitches[key] != true
            }
            if c.itemValid
              item = $dataItems[c.itemId]
              return false unless $gameParty.hasItem?(item)
            }
            if c.actorValid
              actor = $gameActors[c.actorId]
              return false unless $gameParty.members.include?(actor)
            }
            return true
            }
            //--------------------------------------------------------------------------
            // ● イベントページのセットアップ
            //--------------------------------------------------------------------------
            public setupPage(newPage)
            this.page = newPage
            if this.page
              setupPageSettings
            else
              clearPageSettings
            }
            updateBushDepth
            clearStartingFlag
            checkEventTriggerAuto
            }
            //--------------------------------------------------------------------------
            // ● イベントページの設定をクリア
            //--------------------------------------------------------------------------
            public clearPageSettings
            @tileId          = 0
            @characterName   = ""
            @characterIndex  = 0
            @moveType        = 0
            @through          = true
            @trigger          = nil
            @list             = nil
            @interpreter      = nil
            }
            //--------------------------------------------------------------------------
            // ● イベントページの設定をセットアップ
            //--------------------------------------------------------------------------
            public setupPageSettings
            @tileId          = this.page.graphic.tileId
            @characterName   = this.page.graphic.characterName
            @characterIndex  = this.page.graphic.characterIndex
            if @originalDirection != this.page.graphic.direction
              @direction          = this.page.graphic.direction
              @originalDirection = @direction
              @prelockDirection  = 0
            }
            if @originalPattern != this.page.graphic.pattern
              @pattern            = this.page.graphic.pattern
              @originalPattern   = @pattern
            }
            @moveType          = this.page.moveType
            @moveSpeed         = this.page.moveSpeed
            @moveFrequency     = this.page.moveFrequency
            @moveRoute         = this.page.moveRoute
            @moveRouteIndex   = 0
            @moveRouteForcing = false
            @walkAnime         = this.page.walkAnime
            @stepAnime         = this.page.stepAnime
            @directionFix      = this.page.directionFix
            @through            = this.page.through
            @priorityType      = this.page.priorityType
            @trigger            = this.page.trigger
            @list               = this.page.list
            @interpreter = @trigger == 4 ? gameInterpreter.new : nil
            }
            //--------------------------------------------------------------------------
            // ● 接触イベントの起動判定
            //--------------------------------------------------------------------------
            public checkEventTriggerTouch(x, y)
            return if $gameMap.interpreter.running?
            if @trigger == 2 && $gamePlayer.pos?(x, y)
              start if !jumping? && normalPriority?
            }
            }
            //--------------------------------------------------------------------------
            // ● 自動イベントの起動判定
            //--------------------------------------------------------------------------
            public checkEventTriggerAuto
            start if @trigger == 3
            }
            //--------------------------------------------------------------------------
            // ● フレーム更新
            //--------------------------------------------------------------------------
            public update
            super
            checkEventTriggerAuto
            return unless @interpreter
            @interpreter.setup(@list, this.event.id) unless @interpreter.running?
            @interpreter.update
            }
        }
    }
}
