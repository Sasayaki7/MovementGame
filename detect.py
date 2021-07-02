#Sasayaki7
#Rick Momoi
#7/1/2021
#Original program in Python. Wanted to go full-stack so rewrote in JS.



import cv2
import numpy as np
import random
from playsound import playsound
from pathlib import Path 

class Square():
    square_size = (150, 150)
    all_squares = []
    corners = [(0, 0), (0, 500), (400, 0), (400, 500)]
    FADE_FACTOR = 40
    def __init__(self, color, growth_factor=1):
        self.size = (1, 1)
        self.corner = Square.corners[random.randint(0, 3)]
        self.position = (Square.square_size[0] if self.corner[0] == 0 else self.corner[0], Square.square_size[1] if self.corner[1] == 0 else self.corner[1])
        self.growth_factor = growth_factor
        self.init_color = np.array(color)
        self.ticker = 0
        self.grow_ticker = 0
        self.color = np.array(color)
        Square.all_squares.append(self)



    def grow_square(self):
        if self.size[0] < Square.square_size[0]:
            if self.grow_ticker < 10:
                self.grow_ticker += 1
            else:
                self.size = (self.size[0]+1*self.growth_factor, self.size[1]+1*self.growth_factor)
        return self


    def position_square(self):
        if self.corner == Square.corners[0]:
            self.position = self.position - np.array([1,1])
        elif self.corner == Square.corners[1]:
            self.position = self.position - np.array([1, 0])
        elif self.corner == Square.corners[2]:
            self.position = self.position - np.array([0, 1])
        else:
            self.position = self.position - np.array([0, 0])
        return self


    def fade_square(self):
        self.color = self.color-(self.init_color)/40
        if sum(self.color) < 0:
            Square.remove_square(self)
            return None
        else:
            return self


    def increment_ticker(self):
        self.ticker+=1


    def update_square(self):
        if self.size[0] < Square.square_size[0]:
            self.grow_square()
            self.position_square()
        elif self.ticker < 40:
            self.increment_ticker()
        else:
            self.fade_square()
        return self


    def calc_points(self):
        return 20+Square.square_size[0]+Square.square_size[1]-self.size[0]-self.size[1]


    def point_inside_square(self, point):
        return (self.position[0] <= point[0] <= self.position[0]+self.size[0]) and (self.position[1] <= point[1] <= self.position[1]+self.size[1])


    @classmethod
    def get_all_squares(cls):
        return cls.all_squares


    @classmethod
    def remove_square(cls, square):
        cls.all_squares.remove(square)






class Text:

    all_text = []

    def __init__(self, text, position):
        self.text = text
        self.position = position
        self.text_life = 200
        Text.all_text.append(self)


    def decrease_life(self):
        self.text_life -=1
        if self.text_life <= 0:
            Text.remove_text(self)


    @classmethod
    def get_all_text(cls):
        return cls.all_text

    
    @classmethod
    def remove_text(cls, text):
        cls.all_text.remove(text)



frameWidth = 640
frameHeight = 480




color_mask = [109, 73, 40, 134, 255, 223]





def getContours(img):
    contours, hierarchy = cv2.findContours(img, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area > 50:
            cv2.drawContours(imgResult, cnt, -1, (255, 0, 0), 3)
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.02*peri, True)
            x,y,w,h = cv2.boundingRect(approx)


def findColor(img, myColor):
    imgHSV = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    for color in myColor:
        lower = np.array(color[:3])
        upper = np.array(color[3:])
        mask = cv2.inRange(imgHSV, lower, upper)
        getContours(mask)
        #cv.imshow("img", mask)



def drawSquare(image, square):
    cv2.rectangle(image, tuple(square.position), (square.position[0]+square.size[0], square.position[1]+square.size[1]), tuple([int(color) for color in square.color]), -1)



randCorner = random.randint(0, len(Square.corners)-1)

img = cv2.imread('Screenshot_25.png')
cv2.waitKey(0)



points = 0


# cap = cv2.VideoCapture(0)
# cap.set(3, frameWidth)
# cap.set(4, frameHeight)
# cap.set(10, 130)



def get_point(event, x, y, flags, param):
    global points
    if event == cv2.EVENT_LBUTTONDOWN:
        for square in Square.get_all_squares():
            if square.point_inside_square((x, y)):
                Text(f"+{square.calc_points()}", (x,y))
                points+=square.calc_points()
                Square.remove_square(square)



cv2.namedWindow('Test Image')
cv2.setMouseCallback('Test Image', get_point)



playsound(f'{Path.cwd()}\\all-of-the-world.mp3.mp3', block=False)

while True:
    img2=cv2.resize(img.copy(), (800, 450))
    imgHSV = cv2.cvtColor(img2, cv2.COLOR_BGR2HSV)
    lower = np.array(color_mask[:3])
    upper = np.array(color_mask[3:])
    mask = cv2.inRange(imgHSV, lower, upper)
    contours, hierarchy = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    # imgResult = cv2.bitwise_and(imgStack, imgStack, mask=mask)
    contour_areas = list(map(cv2.contourArea, contours))
    max_contour = contours[contour_areas.index(max(contour_areas))]
    moment = cv2.moments(max_contour)
    center_x = int(moment["m10"]/moment["m00"])
    center_y = int(moment["m01"]/moment["m00"])
    cv2.circle(img2, (center_x, center_y), 5, (0, 255, 0), -1)
    # cv.imshow("Result", imgStack)
    # cv.imshow("HSV", imgHSV)
    # cv.imshow("Mask", mask)
    if random.randint(0, 30) == 20:
        Square([255, 0,0], growth_factor=5)
    for square in Square.get_all_squares():
        if square.point_inside_square((center_x, center_y)):
            Text(f"+{square.calc_points()}", (center_x,center_y))
            points+=square.calc_points()
            Square.remove_square(square)
        square.update_square()
        drawSquare(img2, square)
    for text in Text.get_all_text():
        text.decrease_life()
        cv2.putText(img2, text.text, text.position, cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,0))
    cv2.imshow("Mask", mask)
    cv2.imshow('Test Image', img2)


    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
