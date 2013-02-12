#include "mainwindow.h"
#include "ui_mainwindow.h"

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    QGraphicsScene *scene = new QGraphicsScene();
    ui->graphicsView->setScene(scene);
    scene->addLine( QLineF( 10, 10, 20, 20 ) );
}

MainWindow::~MainWindow()
{
    delete ui;
}
