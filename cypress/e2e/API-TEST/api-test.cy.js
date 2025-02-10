describe('CRUD_API', () => {




    context('/products', () => {

        it('/products endpoint bendras testas', () => {

            cy.request("GET", "localhost:3000/products").then((response) => {
                //patikrinti status koda
                expect(response.status).to.be.eq(200);
                //response
                expect(response.duration).to.be.lessThan(1000);//1sec
                expect(response.duration).to.not.be.greaterThan(1000);
                expect(response.duration).to.be.below(1000);

                //patikrinti response.body
                expect(response.body).length.to.be.above(1);
                //Statusas 200 iur gaunam produktus
                //{0,1,2 ...}
                //400 error
                //{
                // error: 'kazkas negerai'
                // }

                console.log('test');
                cy.log('test');

                //response.body turi elementa products 
                // error elemento tikrinimas

                console.log(response.body);
                cy.log(response.body);
                //visi produktai response.body


                // expect()
            });

        });


        it('/products vieno produkto GET bendras testas', () => {

            cy.request("GET", "localhost:3000/products/2").then((response) => {
                expect(response.status).to.be.eq(200);
                // expect(response.body).length.to.be.above(0); //ilgis daugiau nei 0
                expect(response.body).to.have.property('id', 2); //error - sita vieta nepraeis
                expect(response.body).to.have.property('title', 'Kavos Aparatas Full Focus');

                // expect(response.body).to.have.property('title');

                // expect()
                // id == 2 arba title == "Antra prekė" nebutu tuscias
                cy.log(response.body.id);
                cy.log(response.body.title);
                // expect(response.body).length.to.be.greaterThan(0);
                cy.log(response.body);
            });

            cy.log('pasiruosiau testui')
        });

        it('/products CREATE bendras testas', () => {
            cy.request("GET", "localhost:3000/products").then((response) => {
                const existingTitles = response.body.map(product => product.title);
                let newTitle = "naujaPrekė";
                let i = 1;
                const maxIterations = 100; //saugiklis!!!
                while (existingTitles.includes(newTitle) && i < maxIterations) {
                    newTitle = `naujaPrekė${i}`;
                    i++;
                }
                if (i === maxIterations) {
                    throw new Error("Reached maximum iteration limit while generating new title");
                }

                cy.request("POST", "localhost:3000/products", {
                    title: newTitle,
                    description: "naujasAprasymas",
                    price: 4.99
                }).then((response) => {
                    expect(response.status).to.be.eq(201);
                    expect(response.body).to.have.property('title', newTitle);
                    expect(response.body).to.have.property('price', 4.99);
                });
                cy.log('pasiruosiau testui');
            });
        });


        it('/products UPDATE bendras testas', () => {
            cy.request("GET", "localhost:3000/products").then((response) => {
                const productToUpdate = response.body.find(product => product.title.includes("naujaPrekė"));

                if (!productToUpdate) {
                    throw new Error("No product found to update");
                }

                const updatedTitle = productToUpdate.title + "_updated";
                const updatedPrice = productToUpdate.price + 1.00;

                // Send the PUT request to update the product
                cy.request("PUT", `localhost:3000/products/${productToUpdate.id}`, {
                    ...productToUpdate,  // Spread operator to include all original fields
                    title: updatedTitle,
                    price: updatedPrice
                }).then((updateResponse) => {
                    expect(updateResponse.status).to.be.eq(200);
                    expect(updateResponse.body).to.have.property('title', updatedTitle);
                    expect(updateResponse.body).to.have.property('price', updatedPrice);
                });
            });
        });

        it('/products DELETE bendras testas', () => {
            cy.request("GET", "localhost:3000/products").then((response) => {
                const productToDelete = response.body.find(product => product.title.includes("_updated"));
                if (productToDelete) {
                    cy.request("DELETE", `localhost:3000/products/${productToDelete.id}`).then((deleteResponse) => {
                        expect(deleteResponse.status).to.be.eq(200);
                        cy.log(`DEL produkto id: ${productToDelete.id}`);
                        cy.log(`DEL produkto title: ${productToDelete.title}`);
                        cy.log(`Delete: ${deleteResponse.status}`);
                    });
                } else {
                    throw new Error("No updated product found to delete");
                }
            });
            cy.log('pasiruosiau testui')
            
        });
    });

    //users
    //endpoint n+1

    context('/products atskiri testai', () => {
        it('/products status kodas 200', () => {
            cy.request("GET", "localhost:3000/products").then((response) => {
                expect(response.status).to.be.eq(200);
            });
        });
        it('/products atsakymo laikas', () => {
            cy.request("GET", "localhost:3000/products").then((response) => {
                expect(response.duration).to.be.lessThan(1000);
            });
        });
        it('/products netuscias', () => {
            cy.request("GET", "localhost:3000/products").then((response) => {
                expect(response.body).length.to.be.greaterThan(1);
            });
        });
    });

});