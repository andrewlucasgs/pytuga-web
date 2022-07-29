import pako from "pako";
import { Base64 } from "js-base64";

export const getInitialScript = () => {
  let value;
  const url = new URL(window.location.href);
  const script_key = "script";

  if (url.searchParams.has(script_key)) {
    let script = url.searchParams.get(script_key);
    try {
      script = pako.inflate(Base64.toUint8Array(script), { to: "string" });
    } catch {
      script = "";
    }
    value = script;
  } else if (
    window.localStorage != null &&
    window.localStorage.getItem("codeBackup") !== null
  ) {
    value = window.localStorage.getItem("codeBackup");
  } else {
    value = `mostre('Olá, bem-vindo ao Pytuga!')

cor('#196B1F')
espessura(15)
velocidade(5)
levantar()
vai_para(-150,0)
abaixar()

círculo(30,180)
esquerda(90)
frente(100)

levantar()
voltar(40)
esquerda(90)
frente(50)
direita(60)
abaixar()

frente(50)
esquerda(120)
frente(50)
voltar(100)
frente(50)
direita(60)



levantar()
frente(50)
abaixar()

cor('#CC0101')
esquerda(90)
frente(100)
direita(90)
voltar(30)
frente(60)

levantar()
voltar(10)
direita(90)
frente(50)
abaixar()

frente(24)
círculo(26, 180)
frente(24)

levantar()
direita(90)
frente(50)
abaixar()

direita(90)
frente(80)
círculo(-20, 150)
levantar()
direita(30)
frente(70)
abaixar()
círculo(-20, 540)

levantar()
esquerda(180)
frente(20)
direita(90)

frente(30)
abaixar()
circle(-20, extent=360 + 90)
forward(20)
backward(40)

levantar()
frente(40)
esquerda(90)
frente(10)

escrever('web', align="left", font=("Arial", 50, "normal"), color='#000')
frente(100)
    `;
  }
  return value;
};
