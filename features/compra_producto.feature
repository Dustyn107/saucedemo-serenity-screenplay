# language: es
Característica: Compra de productos en SauceDemo
  Como cliente de la tienda SauceDemo
  Quiero comprar un producto
  Para recibirlo en mi domicilio

  Los datos de cada compra (usuario, producto y datos personales)
  se toman del archivo data/compras.xlsx usando la columna "caso".

  @compra
  Esquema del escenario: Compra exitosa de un producto - caso <caso> del Excel
    Dado que "Dustyn" tiene los datos de compra del caso <caso> del archivo "compras.xlsx"
    Y que ha iniciado sesión en SauceDemo
    Cuando agrega el producto al carrito
    Y verifica que el producto se encuentre en el carrito
    Y completa el pago con sus datos personales
    Entonces debería ver el mensaje de confirmación de la compra

    Ejemplos:
      | caso |
      | 1    |
      | 2    |
