describe('Product API Tests', () => {
    const baseUrl = 'http://localhost:3000'; // Change this to your actual API base URL

    it('Should return a list of products', () => {
        cy.request('GET', `${baseUrl}/products`).then((response) => {
            expect(response.status).to.eq(200);          // Check status is 200
            expect(response.body).to.be.an('array');     // Response should be an array
            expect(response.body.length).to.be.greaterThan(0); // Ensure at least one product exists
        });
    });

    it('Should return a single product by ID', () => {
        const productId = 1; // Replace with an existing product ID
        cy.request('GET', `${baseUrl}/products/${productId}`).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('id', productId);
            expect(response.body).to.have.property('title'); // Check that name exists
        });
    });
});