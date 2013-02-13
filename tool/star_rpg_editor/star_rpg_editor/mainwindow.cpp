#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QFile>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow),
    mpSrcPixmap(NULL),
    mpPalettePixmap(NULL)
{
    ui->setupUi(this);

    this->loadPalette();
    this->loadStyleSheet();
}

MainWindow::~MainWindow()
{
    delete ui;
    if (mpSrcPixmap != NULL) {
        delete mpSrcPixmap;
    }
    if (mpPalettePixmap != NULL) {
        delete mpPalettePixmap;
    }
}

void MainWindow::loadStyleSheet()
{
    QFile qss(":/qss/main.qss");
    qss.open(QFile::ReadOnly);
    if( qss.isOpen() )
    {
        qApp->setStyleSheet( qss.readAll() );
    }
}

void MainWindow::loadPalette()
{
    mpSrcPixmap = new QPixmap();
    mpSrcPixmap->load("/Users/sato.daigo/Development/git/star-rpg-framework/html/res/tmx/images/tile_a.png");

    mpPalettePixmap = new QPixmap(256, 1024);
    QPainter pixPaint(mpPalettePixmap);
    pixPaint.drawPixmap(QRect(0, 0, 256, 256), *mpSrcPixmap, QRect(0, 0, 256, 256));
    pixPaint.drawPixmap(QRect(0, 256, 256, 256), *mpSrcPixmap, QRect(256, 0, 256, 256));

    QGraphicsScene *scene = new QGraphicsScene();
    ui->graphicsView->setScene(scene);
    scene->addPixmap(*mpPalettePixmap);
}
