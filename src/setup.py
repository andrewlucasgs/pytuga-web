import traceback
from js import window, Object
from pyodide import to_js
import micropip



async def setup_python():
    await micropip.install(
        [
            'unidecode',
            'polib',
            VITE_BASE_PATH + 'lazyutils-0.3.3-py3-none-any.whl',
            VITE_BASE_PATH + 'transpyler-0.5.0-py3-none-any.whl',
            VITE_BASE_PATH + 'colortools-0.1.2-py3-none-any.whl',
            VITE_BASE_PATH + 'pytuga-0.13.0-py3-none-any.whl',
            VITE_BASE_PATH + 'turtle-0.0.1-py3-none-any.whl'
        ],
        keep_going=True)
    patch_turtle()



def run_code(code):
    namespace = {} 
    from pytuga import PytugaTranspyler
    

    pytugues = PytugaTranspyler(
        translations={
            **PytugaTranspyler.translations,
            **tugalinhaTranslations
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
