/// <reference path='../../underscore.d.ts' />

//==============================================================================
// ■ Game_Map
//------------------------------------------------------------------------------
// 　マップを扱うクラスです。スクロールや通行可能判定などの機能を持っています。
// このクラスのインスタンスは $gameMap で参照されます。
//==============================================================================

class Game_Map {
    //--------------------------------------------------------------------------
    // ● Private変数
    //--------------------------------------------------------------------------
    private map_: any;
    private mapId_: number;
    private tilesetId_: number;
    private tileEvents_: number[];

    // Scrolling
    private scrollDirection_: number;
    private scrollRest_: number;
    private scrollSpeed_: number;

    // Parallax
    private parallaxLoopX_: bool;
    private parallaxLoopY_: bool;
    private parallaxSx_: number;
    private parallaxSy_: number;
    private parallaxX_: number;
    private parallaxY_: number;

    private screen_: any;                     // マップ画面の状態
    private interpreter_: any;                // マップイベント用インタプリタ
    private events_: any;                     // イベント
    private displayX_: number;                // 表示 X 座標
    private displayY_: number;                // 表示 Y 座標
    private parallaxName_: string;            // 遠景 ファイル名
    private battleback1Name_: string;         // 戦闘背景（床）ファイル名
    private battleback2Name_: string;         // 戦闘背景（壁）ファイル名

    //--------------------------------------------------------------------------
    // ● 公開インスタンス変数
    //--------------------------------------------------------------------------
    
    // ReadOnly
    public get screen: any {return this.screen_;}                   // マップ画面の状態
    public get interpreter: any {return this.interpreter_;}               // マップイベント用インタプリタ
    public get events: any {return this.events_;}                   // イベント
    public get displayX: number {return this.displayX_;}   
    public get displayY: number {return this.displayX_;}               // 表示 Y 座標
    public get parallaxName: string {return this.parallaxName_;}
    public get battleback1Name: string {return this.battleback1Name_;}
    public get battleback2Name: string {return this.battleback2Name_;}

    // Read & Write
    public nameDisplay: bool;                 // マップ名表示フラグ
    public needRefresh: bool;                 // リフレッシュ要求フラグ

    //--------------------------------------------------------------------------
    // ● オブジェクト初期化
    //--------------------------------------------------------------------------
    constructor {
        this.screen = null;//TODO new Game_Screen();
        this.interpreter = null;//TODO new Game_Interpreter();
        this.mapId_ = 0;
        this.events = {};
        this.displayX_ = 0;
        this.displayY_ = 0;
        this.nameDisplay = true;
    }
    //--------------------------------------------------------------------------
    // ● セットアップ
    //--------------------------------------------------------------------------
    public setup(mapId: number): void {
        this.mapId_ = mapId;
        this.map_ = null;// TODO loadData(sprintf("Data/Map%03d.rvdata2", this.mapId_))
        this.tilesetId_ = this.map_.tilesetId;
        this.displayX_ = 0;
        this.displayY_ = 0;
        this.setupEvents();
        this.setupScroll();
        this.setupParallax();
        this.needRefresh = false;
    }
    //--------------------------------------------------------------------------
    // ● イベントのセットアップ
    //--------------------------------------------------------------------------
    private setupEvents(): void {
        this.events_ = {}

        // Game_ event
        _.each(this.map_.events, (event) => {
            this.events_[i] = new Game_Event(this.mapId_, event);
        });

        // Common event
        this.commonEvents_ = _.collect(this.parallelCommonEvents(), (commonEvent) => {
            return new Game_CommonEvent(commonEvent.id);
        });

        this.refreshTileEvents();
    }
    //--------------------------------------------------------------------------
    // ● 並列処理コモンイベントの配列を取得
    //--------------------------------------------------------------------------
    public parallelCommonEvents(): any {
        return _.select($dataCommonEvents, (event) => event && event.isParallel());
    }
    //--------------------------------------------------------------------------
    // ● スクロールのセットアップ
    //--------------------------------------------------------------------------
    private setupScroll(): void {
        this.scrollDirection_ = 2;
        this.scrollRest_ = 0;
        this.scrollSpeed_ = 4;
    }
    //--------------------------------------------------------------------------
    // ● 遠景のセットアップ
    //--------------------------------------------------------------------------
    private setupParallax(): void {
        this.parallaxName_ = this.map_.parallaxName_;
        this.parallaxLoopX_ = this.map_.parallaxLoopX_;
        this.parallaxLoopY_ = this.map_.parallaxLoopY_;
        this.parallaxSx = this.map_.parallaxSx;
        this.parallaxSy = this.map_.parallaxSy;
        this.parallaxX_ = 0
        this.parallaxY_ = 0
    }
    //--------------------------------------------------------------------------
    // ● 表示位置の設定
    //--------------------------------------------------------------------------
    public setDisplayPos(x: number, y: number): void {
        x = [0, [x, width - this.screenTileX].min].max unless isLoopHorizontal()
        y = [0, [y, height - this.screenTileY].min].max unless isLoopVertical()
        this.displayX_ = (x + width) % width
        this.displayY_ = (y + height) % height
        this.parallaxX_ = x
        this.parallaxY_ = y
    }
    //--------------------------------------------------------------------------
    // ● 遠景表示の原点 X 座標の計算
    //--------------------------------------------------------------------------
    public parallaxOx(bitmap: any): number {
        if (this.parallaxLoopX_) {
            return this.parallaxX_ * 16;
        } else {
            var w1: number = Math.max(bitmap.width - Graphics.width, 0);
            var w2: number = Math.max(this.width * 32 - Graphics.width, 1);
            return this.parallaxY_ * 16 * w1 / w2;
        }
    }
    //--------------------------------------------------------------------------
    // ● 遠景表示の原点 Y 座標の計算
    //--------------------------------------------------------------------------
    public parallaxOy(bitmap: any): number {
        if (this.parallaxLoopY_) {
            return this.parallaxY_ * 16;
        } else {
            var h1: number = Math.max(bitmap.height - Graphics.height, 0);
            var h2: number = Math.max(this.height * 32 - Graphics.height, 1);
            return this.parallaxY_ * 16 * h1 / h2;
        }
    }
    //--------------------------------------------------------------------------
    // ● マップ ID の取得
    //--------------------------------------------------------------------------
    public get mapId(): number {
        return this.mapId_;
    }
    //--------------------------------------------------------------------------
    // ● タイルセットの取得
    //--------------------------------------------------------------------------
    public geet tileset(): any {
        return $dataTilesets[this.tilesetId_];
    }
    //--------------------------------------------------------------------------
    // ● 表示名の取得
    //--------------------------------------------------------------------------
    public get displayName(): string {
        return this.map_.displayName;
    }
    //--------------------------------------------------------------------------
    // ● 幅の取得
    //--------------------------------------------------------------------------
    public get width(): number {
        return this.map_.width;
    }
    //--------------------------------------------------------------------------
    // ● 高さの取得
    //--------------------------------------------------------------------------
    public get height(): number {
        return this.map_.height;
    }
    //--------------------------------------------------------------------------
    // ● 横方向にループするか？
    //--------------------------------------------------------------------------
    public get isLoopHorizontal(): bool {
        return this.map_.scrollType == 2 || this.map_.scrollType == 3;
    }
    //--------------------------------------------------------------------------
    // ● 縦方向にループするか？
    //--------------------------------------------------------------------------
    public get isLoopVertical(): bool {
        return this.map_.scrollType == 1 || this.map_.scrollType == 3;
    }
    //--------------------------------------------------------------------------
    // ● ダッシュ禁止か否かの取得
    //--------------------------------------------------------------------------
    public get isDisableDash(): bool {
        return this.map_.disableDashing;
    }
    //--------------------------------------------------------------------------
    // ● エンカウントリストの取得
    //--------------------------------------------------------------------------
    public encounterList(): any {
        return this.map_.encounterList
    }
    //--------------------------------------------------------------------------
    // ● エンカウント歩数の取得
    //--------------------------------------------------------------------------
    public get encounterStep(): number {
        return this.map_.encounterStep;
    }
    //--------------------------------------------------------------------------
    // ● マップデータの取得
    //--------------------------------------------------------------------------
    public get data(): any {
        return this.map_.data;
    }
    //--------------------------------------------------------------------------
    // ● フィールドタイプか否か
    //--------------------------------------------------------------------------
    public get isOverworld(): bool {
        return this.tileset.mode == 0;
    }
    //--------------------------------------------------------------------------
    // ● 画面の横タイル数
    //--------------------------------------------------------------------------
    public get screenTileX(): number {
        return Graphics.width / 32;
    }
    //--------------------------------------------------------------------------
    // ● 画面の縦タイル数
    //--------------------------------------------------------------------------
    public get screenTileY(): number {
        return Graphics.height / 32;
    }
    //--------------------------------------------------------------------------
    // ● 表示座標を差し引いた X 座標の計算
    //--------------------------------------------------------------------------
    public adjustX(x: number): number {
        if (this.isLoopHorizontal() && 
            x < this.displayX_ - (this.width - this.screenTileX) / 2) {
            return x - this.displayX_ + this.map_.width;
        } else {
            return x - this.displayX_;
        }
    }
    //--------------------------------------------------------------------------
    // ● 表示座標を差し引いた Y 座標の計算
    //--------------------------------------------------------------------------
    public adjustY(y: number): number {
        if (isLoopVertical() && 
            y < this.displayY_ - (this.height - this.screenTileY) / 2) {
            return y - this.displayY_ + this.map_.height;
        } else {
            return y - this.displayY_;
        }
    }
    //--------------------------------------------------------------------------
    // ● ループ補正後の X 座標計算
    //--------------------------------------------------------------------------
    public roundX(x: number): number {
        return this.isLoopHorizontal() ? (x + width) % width : x
    }
    //--------------------------------------------------------------------------
    // ● ループ補正後の Y 座標計算
    //--------------------------------------------------------------------------
    public roundY(y: number): number {
        return this.isLoopVertical() ? (y + height) % height : y;
    }
    //--------------------------------------------------------------------------
    // ● 特定の方向に 1 マスずらした X 座標の計算（ループ補正なし）
    //--------------------------------------------------------------------------
    public xWithDirection(x: number, d: number) {
        return x + (d == 6 ? 1 : d == 4 ? -1 : 0);
    }
    //--------------------------------------------------------------------------
    // ● 特定の方向に 1 マスずらした Y 座標の計算（ループ補正なし）
    //--------------------------------------------------------------------------
    public yWithDirection(y: number, d: number) {
        return y + (d == 2 ? 1 : d == 8 ? -1 : 0);
    }
    //--------------------------------------------------------------------------
    // ● 特定の方向に 1 マスずらした X 座標の計算（ループ補正あり）
    //--------------------------------------------------------------------------
    public roundXWithDirection(x: number, d: number): number {
        return this.roundX(x + (d == 6 ? 1 : d == 4 ? -1 : 0));
    }
    //--------------------------------------------------------------------------
    // ● 特定の方向に 1 マスずらした Y 座標の計算（ループ補正あり）
    //--------------------------------------------------------------------------
    public roundYWithDirection(y: number, d: number): number {
        return this.roundY(y + (d == 2 ? 1 : d == 8 ? -1 : 0));
    }
    //--------------------------------------------------------------------------
    // ● BGM / BGS 自動切り替え
    //--------------------------------------------------------------------------
    public autoplay(): void {
        if (this.map_.autoplayBgm) {
            this.map_.bgm.play();
        }

        if (this.map_.autoplayBgs) {
            this.map_.bgs.play();
        }
    }
    //--------------------------------------------------------------------------
    // ● リフレッシュ
    //--------------------------------------------------------------------------
    public refresh(): void {
        for (var i = 0; i < this.events_.length; i++) {
            this.events_[i].refresh();
        }
        for (var i = 0; i < this.commonEvents_.length; i++) {
            this.commonEvents_[i].refresh();
        }
        this.refreshTileEvents();
        this.needRefresh = false;
    }
    //--------------------------------------------------------------------------
    // ● タイル扱いイベントの配列をリフレッシュ
    //--------------------------------------------------------------------------
    public refreshTileEvents(): void {
        this.tileEvents_ = _.select(
            _.values(this.events_), 
            (event) => event.isTile()
        );
    }
    //--------------------------------------------------------------------------
    // ● 指定座標に存在するイベントの配列取得
    //--------------------------------------------------------------------------
    public eventsXY_(x: number, y: number): any[] {
        return _.select(
            _.values(this.events_), 
            (event) => event.isPos(x, y)
        );
    }
    //--------------------------------------------------------------------------
    // ● 指定座標に存在するイベント（すり抜け以外）の配列取得
    //--------------------------------------------------------------------------
    public eventsXYNt(x: number, y: number): any[] {
        return _.select(
            _.values(this.events_), 
            (event) => event.isPosNt(x, y)
        );
    }
    //--------------------------------------------------------------------------
    // ● 指定座標に存在するタイル扱いイベント（すり抜け以外）の配列取得
    //--------------------------------------------------------------------------
    public tileEventsXY(x: number, y: number): any[] {
        return _.select(
            this.tileEvents_, 
            (event) => event.isPosNt(x, y)
        );
    }
    //--------------------------------------------------------------------------
    // ● 指定座標に存在するイベントの ID 取得（一つのみ）
    //--------------------------------------------------------------------------
    public eventIdXY_(x: number, y: number): number {
      list = this.eventsXY(x, y);
      return _.isEmpty(list) ? 0 : list[0].id;
    }
    //--------------------------------------------------------------------------
    // ● 下にスクロール
    //--------------------------------------------------------------------------
    public scrollDown(distance: number): void {
        if isLoopVertical() {
            this.displayY_ += distance;
            this.displayY_ %= this.map_.height;
            if (this.parallaxLoopY_) {
                this.parallaxY_ += distance;
            }
        } else {
            lastY_ = this.displayY_
            this.displayY_ = Math.min(this.displayY_ + distance, this.height - this.screenTileY);
            this.parallaxY_ += this.displayY_ - lastY_
        }
    }
    //--------------------------------------------------------------------------
    // ● 左にスクロール
    //--------------------------------------------------------------------------
    public scrollLeft(distance): void {
        if (this.isLoopHorizontal()) {
            this.displayX_ += this.map_.width - distance
            this.displayX_ %= this.map_.width 
            if (this.parallaxLoopX_) {
                this.parallaxX_ -= distance;
            }
        } else {
            var lastX: number = this.displayX_;
            this.displayX_ = Math.max(this.displayX_ - distance, 0);
            this.parallaxX_ += this.displayX_ - lastX;
        }
    }
    //--------------------------------------------------------------------------
    // ● 右にスクロール
    //--------------------------------------------------------------------------
    public scrollRight(distance): void {
        if (isLoopHorizontal()) {
            this.displayX_ += distance
            this.displayX_ %= this.map_.width
            if (this.parallaxLoopX_) {
                this.parallaxX_ += distance;
            }
        } else {
            var lastX: number = this.displayX_
            this.displayX_ = Math.min(this.displayX_ + distance, this.width - this.screenTileX);
            this.parallaxX_ += this.displayX_ - lastX;
        }
    }
    //--------------------------------------------------------------------------
    // ● 上にスクロール
    //--------------------------------------------------------------------------
    public scrollUp(distance): void {
        if (this.isLoopVertical()) {
            this.displayY_ += this.map_.height - distance;
            this.displayY_ %= this.map_.height;
            if (this.parallaxLoopY_) {
                this.parallaxY_ -= distance;
            }
        } else {
            var lastY: number = this.displayY_;
            this.displayY_ = Math.max(this.displayY_ - distance, 0);
            this.parallaxY_ += this.displayY_ - lastY;
        }
    }
    //--------------------------------------------------------------------------
    // ● 有効座標判定
    //--------------------------------------------------------------------------
    public isValid(x, y): bool {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }
    //--------------------------------------------------------------------------
    // ● 通行チェック
    //     bit : 調べる通行禁止ビット
    //--------------------------------------------------------------------------
    public checkPassage(x: number, y: number, bit: number): bool {
        var tileIds: number[] = this.allTiles(x, y);
        for (var i = 0; i < tileIds.length; i++) {
            var tileId: number = tileIds[i];
            var flag: bool = this.tileset.flags[tileId];
            if (flag & 0x10 != 0) {
                continue;     // [☆] : 通行に影響しない
            }
            if (flag & bit == 0) {
                return true;  // [○] : 通行可
            }
            if (flag & bit == bit) {
                return false; // [×] : 通行不可
            }
        }

        return false;         // 通行不可
    }
    //--------------------------------------------------------------------------
    // ● 指定座標にあるタイル ID の取得
    //--------------------------------------------------------------------------
    public tileId(x: number, y: number, z: number): number {
        return this.map_.data[x, y, z] || 0;
    }
    //--------------------------------------------------------------------------
    // ● 指定座標にある全レイヤーのタイル（上から順）を配列で取得
    //--------------------------------------------------------------------------
    public layeredTiles(x: number, y: number): any {
        var result = [];
        for (var z = 2; z >= 0; z--) {
            result.push(this.tileId(x, y, z));
        }
        return result;
    }
    //--------------------------------------------------------------------------
    // ● 指定座標にある全てのタイル（イベント含む）を配列で取得
    //--------------------------------------------------------------------------
    public allTiles(x: number, y: number): number[] {
        var tileEvents = _.collect(this.tileEventsXY_(x, y), (event) => event.tileId);
        var layerdTiles = this.layeredTiles(x, y);
        return _.union(tileEvents, layerdTiles);
    }
    //--------------------------------------------------------------------------
    // ● 指定座標にあるオートタイルの種類を取得
    //--------------------------------------------------------------------------
    public autotileType(x: number, y: number, z: number): number {
        var tileId: number = this.tileId(x, y, z);
        return tileId >= 2048 ? (tileId - 2048) / 48 : -1;
    }
    //--------------------------------------------------------------------------
    // ● 通常キャラの通行可能判定
    //     d : 方向（2,4,6,8）
    //    指定された座標のタイルが指定方向に通行可能かを判定する。
    //--------------------------------------------------------------------------
    public isPassable(x: number, y: number, d: number): bool {
        this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    }
    //--------------------------------------------------------------------------
    // ● 指定座標の全レイヤーのフラグ判定
    //--------------------------------------------------------------------------
    public isLayeredTilesFlag(x, y, bit): bool {
        this.layeredTiles(x, y).any? {|tileId| tileset.flags[tileId] & bit != 0 }
    }
    //--------------------------------------------------------------------------
    // ● 梯子判定
    //--------------------------------------------------------------------------
    public isLadder(x: number, y: number): bool {
        this.isValid(x, y) && isLayeredTilesFlag(x, y, 0x20)
    }
    //--------------------------------------------------------------------------
    // ● 茂み判定
    //--------------------------------------------------------------------------
    public isBush(x: number, y: number): bool {
        this.isValid(x, y) && isLayeredTilesFlag(x, y, 0x40)
    }
    //--------------------------------------------------------------------------
    // ● カウンター判定
    //--------------------------------------------------------------------------
    public isCounter(x: number, y: number): bool {
        this.isValid(x, y) && isLayeredTilesFlag(x, y, 0x80)
    }
    //--------------------------------------------------------------------------
    // ● ダメージ床判定
    //--------------------------------------------------------------------------
    public isDamagerFloor(x: number, y: number): bool {
        this.isValid(x, y) && isLayeredTilesFlag(x, y, 0x100)
    }
    //--------------------------------------------------------------------------
    // ● 地形タグの取得
    //--------------------------------------------------------------------------
    public terrainTag(x: number, y: number): number {
        var tag: number = 0;

        // If terrain is not valid, simply return it
        if (!this.isValid(x, y)) {
            return tag;
        }

        // Find any terrain with valid tag
        _.every(this.layeredTiles(x, y), (tileId:number) => {
            tag = tileset.flags[tileId] >> 12;
            return tag == 0;
        })

        return tag;
    }
    //--------------------------------------------------------------------------
    // ● リージョン ID の取得
    //--------------------------------------------------------------------------
    public get regionId(x: number, y: number): number {
        this.isValid(x, y) ? this.map_.data[x, y, 3] >> 8 : 0;
    }
    //--------------------------------------------------------------------------
    // ● スクロールの開始
    //--------------------------------------------------------------------------
    public startScroll(direction, distance, speed): void {
        this.scrollDirection_ = direction;
        this.scrollRest_ = distance;
        this.scrollSpeed_ = speed;
    }
    //--------------------------------------------------------------------------
    // ● スクロール中判定
    //--------------------------------------------------------------------------
    public get isScrolling(): bool {
        return this.scrollRest_ > 0;
    }
    //--------------------------------------------------------------------------
    // ● フレーム更新
    //     main : インタプリタ更新フラグ
    //--------------------------------------------------------------------------
    public update(main: bool = false) {
        if (this.needRefresh) {
            this.refresh();
        }

        if (main) {
            this.updateInterpreter();
        }

        this.updateScroll();
        this.updateEvents();
        this.updateParallax();
        this.screen_.update();
    }
    //--------------------------------------------------------------------------
    // ● スクロールの更新
    //--------------------------------------------------------------------------
    public updateScroll(): void {
        return unless isScrolling()
        var lastX: number = this.displayX_;
        var lastY: number = this.displayY_
        this.doScroll(this.scrollDirection_, this.scrollDistance);
        if (this.displayX_ == lastX && this.displayY_ == lastY) {
            this.scrollRest_ = 0;
        } else {
            this.scrollRest_ -= scrollDistance;
        }
    }
    //--------------------------------------------------------------------------
    // ● スクロール距離の計算
    //--------------------------------------------------------------------------
    public get scrollDistance(): number {
        return Math.pow(2, this.scrollSpeed_) / 256.0;
    }
    //--------------------------------------------------------------------------
    // ● スクロールの実行
    //--------------------------------------------------------------------------
    public doScroll(direction: number, distance: number): void {
        switch(direction) {
            case 2:  scrollDown (distance); break;
            case 4:  scrollLeft (distance); break;
            case 6:  scrollRight (distance); break;
            case 8:  scrollUp (distance); break;
        }
    }
    //--------------------------------------------------------------------------
    // ● イベントの更新
    //--------------------------------------------------------------------------
    public updateEvents(): void {
        _.each(this.events_, (event) => event.update());
        _.each(this.commonEvents_, (event) => event.update());
    }
    //--------------------------------------------------------------------------
    // ● 遠景の更新
    //--------------------------------------------------------------------------
    public updateParallax(): void {
        if (this.parallaxLoopX_) {
            this.parallaxX_ += this.parallaxSx / 64.0;
        }
        if (this.parallaxLoopY_) {
            this.parallaxY_ += this.parallaxSy / 64.0;
        }
    }
    //--------------------------------------------------------------------------
    // ● タイルセットの変更
    //--------------------------------------------------------------------------
    public changeTileset(tilesetId: number) {
        this.tilesetId_ = tilesetId;
        this.refresh();
    }
    //--------------------------------------------------------------------------
    // ● 遠景の変更
    //--------------------------------------------------------------------------
    public changeParallax(name: string, 
                          loopX: number, 
                          loopY: number, 
                          sx: number, 
                          sy: number): void {

        this.parallaxName_ = name
        if (this.parallaxLoopX_ && !loopX) {
            this.parallaxX_ = 0;
        }
        if (this.parallaxLoopY_ && !loopY) {
            this.parallaxY_ = 0;
        }
        this.parallaxLoopX_ = loopX;
        this.parallaxLoopY_ = loopY;
        this.parallaxSx = sx;
        this.parallaxSy = sy;
    }
    //--------------------------------------------------------------------------
    // ● インタプリタの更新
    //--------------------------------------------------------------------------
    public updateInterpreter(): void {
      while(true) {
        this.interpreter_.update();
        if (this.interpreter_.isRunning()) {
            return;
        }
        if (this.interpreter_.eventId > 0) {
            this.unlockEvent(this.interpreter_.eventId);
            this.interpreter_.clear();
        }

        if (!this.setupStartingEvent()) {
            return;
        }
      }
    }
    //--------------------------------------------------------------------------
    // ● イベントのロック解除
    //--------------------------------------------------------------------------
    public unlockEvent(eventId: number): void {
        if (this.events_[eventId]) {
            this.events_[eventId].unlock();
        }
    }
    //--------------------------------------------------------------------------
    // ● 起動中イベントのセットアップ
    //--------------------------------------------------------------------------
    public setupStartingEvent(): void {
        if (this.needRefresh) {
            this.refresh();
        }

        if (this.interpreter_.setupReservedCommonEvent()) {
            return true;
        }

        if (this.setupStartingMapEvent()) {
            return true;
        }

        if (this.setupAutorunCommonEvent()) {
            return true;
        }
        return false
    }
    //--------------------------------------------------------------------------
    // ● 起動中マップイベントの存在判定
    //--------------------------------------------------------------------------
    public isAnyEventStarting(): bool {
        _.any(_.values(this.events, (event) => event.isStarting());
    }
    //--------------------------------------------------------------------------
    // ● 起動中のマップイベントを検出／セットアップ
    //--------------------------------------------------------------------------
    public setupStartingMapEvent(): void {
        // TODO Game__Event
        var event:any = _.find(
            _.values(this.events), 
            (event)=> event.isStarting()
        );

        if (event) {
            event.clearStartingFlag();
            this.interpreter_.setup(event.list, event.id);
        }
        return event;
    }
    //--------------------------------------------------------------------------
    // ● 自動実行のコモンイベントを検出／セットアップ
    //--------------------------------------------------------------------------
    public setupAutorunCommonEvent(): any {
        // TODO Game__CommonEvent
        var event:any = _.find($dataCommonEvents, (event)=> 
            event && event.isAutoRun() && $gameSwitches[event.switchId];
        );

        if (event) {
            this.interpreter_.setup(event.list);
        }
        return event;
    }
}
