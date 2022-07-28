# from pytuga import PytugaTranspyler
import sys
import io
import traceback
from js import window, Object
from pyodide import to_js
import micropip


async def setup_python():
    await micropip.install(
        [
            'unidecode',
            'polib',
            '/lazyutils-0.3.3-py3-none-any.whl',
            '/transpyler-0.5.0-py3-none-any.whl',
            '/colortools-0.1.2-py3-none-any.whl',
            '/pytuga-0.13.0-py3-none-any.whl',
            '/turtle-0.0.1-py3-none-any.whl'
        ],
        keep_going=True)
    patch_turtle()



def run_code(code):
    namespace = {}  # use separate namespace to hide run_code, modules, etc.
    from pytuga import PytugaTranspyler
    

    """run specified code and return stdout and stderr"""
    pytugues = PytugaTranspyler(
        translations={
            **PytugaTranspyler.translations,
            **{
                'trás': 'back',
                'trás': 'backward',
                'trás': 'bk',
                'círculo': 'circle',
                'limpar': 'clear',
                'cor': 'color',
                'graus': 'degrees',
                'distancia': 'distance',
                'produto_escalar': 'dot',
                'abaixar_caneta': 'down',
                'frente': 'fd',
                'definir_cor': 'fillcolor',
                'frente': 'forward',
                'get_poly': 'get_poly',
                'getpen': 'getpen',
                'obter_tela': 'getscreen',
                'get_shapepoly': 'get_shapepoly',
                'tartaruga': 'getturtle',
                'vai_para': 'goto',
                'cabeçalho': 'heading',
                'tartaruga': 'hideturtle',
                'casa': 'home',
                'ht': 'ht',
                'está_para_baixo': 'isdown',
                'é_visível': 'isvisible',
                'esquerda': 'left',
                'esq': 'lt',
                'ao_clicar': 'onclick',
                'arrastar': 'ondrag',
                'no_lançamento': 'onrelease',
                'pd': 'pd',
                'caneta': 'pen',
                'caneta_cor': 'pencolor',
                'pendurada': 'pendown',
                'tamanho_de_caneta': 'pensize',
                'penitenciária': 'penup',
                'posição': 'pos',
                'posição': 'position',
                'pu': 'pu',
                'radianos': 'radians',
                'direita': 'right',
                'Redefinir': 'reset',
                'modo_de_redimensionamento': 'resizemode',
                'dir': 'rt',
                'set': 'seth',
                'inflexão': 'setheading',
                'setpos': 'setpos',
                'posição_definida': 'setposition',
                'ajustar_emaranhado': 'settiltangle',
                'setundobuffer': 'setundobuffer',
                'setx': 'setx',
                'sety': 'sety',
                'forma': 'shape',
                'tamanho_da_forma': 'shapesize',
                'metamorfosear': 'shapetransform',
                'fator_de_cisalhamento': 'shearfactor',
                'showturtle': 'showturtle',
                'definir_velocidade': 'speed',
                'rua': 'st',
                'carimbo': 'stamp',
                'inclinar': 'tilt',
                'ângulo_de_inclinaçao': 'tiltangle',
                'em_direção': 'towards',
                'tamanho_de_tartaruga': 'turtlesize',
                'desfazer': 'undo',
                'desfazer_entradas_de_buffer': 'undobufferentries',
                'acima': 'up',
                'largura': 'width',
                'escrever': 'write',
                'xcor': 'xcor',
                'ycor': 'ycor'
            }
        }
    )

    try:
        code = 'from turtle import *\n' + code 
        code += '\ndone()'
        pytugues.exec(code, namespace)
    except Exception as e:
        traceback.format_exc()
        traceback.print_exc()

def patch_turtle():
    """
    Patch Turtle to render figures.
    """
    from turtle import Screen

    # patching show_scene
    if not hasattr(Screen, "_original_show_scene"):
        Screen._original_show_scene = Screen.show_scene

    def show_scene(self):
        root = self._original_show_scene()
        window.customDispatchEvent("eval.display", Object.fromEntries(
            to_js({"display_type": "turtle", "content": root})))
        self.restart()

    show_scene.__doc__ = Screen._original_show_scene.__doc__

    Screen.show_scene = show_scene


setup_python()
