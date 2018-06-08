let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

/*before((done) => {
    db.payments.remove({}, () => {
       done();
    });
});*/

describe('/GET payment when no payments exist', () => {
    it('it should GET all the payments', (done) => {
          chai.request(server)
          .get('/api/payments')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(0);
              done();
          });
    });
});


describe('/GET payment when a payment exists', () => {
    before( (done) => {
        let payment = {
            _id:1,
            annualSalary:81900,
            firstName:"John",
            grossIncome:6825,
            incomeTax:1521,
            isNew:true,
            lastName:"Snow",
            netIncome:5304,
            pay:4690,
            payPeriod:"2018-05-30T01:00:00.000Z",
            payPeriodFormatted:"30 May 2018",
            payPeriodMonth:"Month of May",
            super:614,
            superRate:9
        }

    chai.request(server)
        .post('/api/payment')
        .send(payment)
        .end(done())
    })

    it('it should GET the payment', (done) => {
          chai.request(server)
          .get('/api/payments')
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('array');
              res.body.length.should.be.eql(1);
              done();
          });
    });
});
