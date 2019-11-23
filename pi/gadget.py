import logging
import sys
import json
from agt import AlexaGadget
from sense_hat import SenseHat

logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)
logger = logging.getLogger(__name__)

sense = SenseHat()
sense.clear()

RED = [255, 0, 0]
GREEN = [0, 255, 0]
BLUE = [0, 0, 255]
YELLOW = [255, 255, 0]
BLACK = [0, 0, 0]

class Gadget(AlexaGadget):
    def on_alexa_gadget_statelistener_stateupdate(self, directive):
        for state in directive.payload.states:
            if state.name == 'wakeword':
                sense.clear()
                if state.value == 'active':
                    sense.show_message("Alexa", text_colour=BLUE)

    def set_color_to(self, color):
        sense.set_pixels(([color] * 64))

    def on_custom_gonzalo123_setcolor(self, directive):
        payload = json.loads(directive.payload.decode("utf-8"))
        color = payload['color']

        if color == 'red':
            logger.info('turn on RED display')
            self.set_color_to(RED)

        if color == 'green':
            logger.info('turn on GREEN display')
            self.set_color_to(GREEN)

        if color == 'yellow':
            logger.info('turn on YELLOW display')
            self.set_color_to(YELLOW)

        if color == 'black':
            logger.info('turn on YELLOW display')
            self.set_color_to(BLACK)


if __name__ == '__main__':
    Gadget().main()
