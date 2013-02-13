#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QFile>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    QPixmap pixmap;
    pixmap.load("/Users/sato.daigo/Development/git/star-rpg-framework/html/res/tmx/images/tile_a.png");

    QPixmap  pixmap2 = QPixmap(256, 1024);
    QPainter pixPaint(&pixmap2);
    pixPaint.drawPixmap(QRect(0, 0, 256, 256), pixmap, QRect(0, 0, 256, 256));
    pixPaint.drawPixmap(QRect(0, 256, 256, 256), pixmap, QRect(256, 0, 256, 256));

    QGraphicsScene *scene = new QGraphicsScene();
    ui->graphicsView->setScene(scene);
    scene->addPixmap(pixmap2);

    QFile qss(":/qss/main.qss");
    qss.open(QFile::ReadOnly);
    if( qss.isOpen() )
    {
        qApp->setStyleSheet( qss.readAll() );
    }
}

MainWindow::~MainWindow()
{
    delete ui;
}
