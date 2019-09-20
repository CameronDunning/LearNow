-- Resources table seeds
INSERT INTO resources
  (user_id, title, link, bitly_link, cover_photo_url, description, tag, date_created)
VALUES
  (1, 'Erlenmeyer Flask', 'https://en.wikipedia.org/wiki/Erlenmeyer_flask', 'http://bit.ly/2mrsqYK', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/20150320-OSEC-LSC-0080_%2816299658674%29.jpg/800px-20150320-OSEC-LSC-0080_%2816299658674%29.jpg', 'Erlenmeyer flask', 'science', Now()),
  (1, 'Graduated Cyclinder', 'https://en.wikipedia.org/wiki/Graduated_cylinder', 'http://bit.ly/2kL9iEG', 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Different_types_of_graduated_cylinder-_10ml%2C_25ml%2C_50ml_and_100_ml_graduated_cylinder.jpg', 'Graduated Cyclinder', 'science', Now()),
  (1, 'Beaker', 'https://en.wikipedia.org/wiki/Beaker_(glassware)', 'http://bit.ly/2kV7J72', 'https://upload.wikimedia.org/wikipedia/commons/1/12/Beakers.jpg', 'Beaker', 'science', Now()),
  (2, 'Pipette', 'https://en.wikipedia.org/wiki/Pipette', 'http://bit.ly/2kwTy86', 'https://upload.wikimedia.org/wikipedia/commons/5/58/Pipettes.jpg', 'Pipette', 'science', Now()),
  (1, 'Factorial', 'https://en.wikipedia.org/wiki/Factorial', 'http://bit.ly/2kwUhpQ', 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Mplwp_factorial_gamma_stirling.svg/1920px-Mplwp_factorial_gamma_stirling.svg.png', 'Factorial', 'math', Now()),
  (2, 'Exponents', 'https://en.wikipedia.org/wiki/Exponentiation', 'http://bit.ly/2kX8RH8', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Expo02.svg/1024px-Expo02.svg.png', 'Exponents are the best!', 'math', Now()),
  (3, 'Fractions', 'https://en.wikipedia.org/wiki/Fraction_(mathematics)', 'http://bit.ly/2lXldzj', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Cake_quarters.svg/1280px-Cake_quarters.svg.png', 'Fraction cakes', 'math', Now()),
  (3, 'Division', 'https://en.wikipedia.org/wiki/Division_(mathematics)', 'http://bit.ly/2m5cPh6', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Divide20by4.svg/800px-Divide20by4.svg.png', 'How about them apples?', 'math', Now());
