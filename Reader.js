// Dependencies
var natural = require('natural');
var awsServices = 'appstream cloudformation cloudfront cloudsearch cloudtrail cloudwatch codedeploy zocalo'
var TOP_N = 25;

console.log('Loading event');
var aws = require('aws-sdk');
var s3 = new aws.S3({apiVersion: '2006-03-01'});
var ddb = new aws.DynamoDB({region: 'us-east-1'});
var inputDir = 'reader/input/';

exports.handler = function(event, context) {
   // console.log('Received event:');
   // console.log(JSON.stringify(event, null, '  '));
   // Get the object from the event and show its content type
   var bucket = event.Records[0].s3.bucket.name;
   var key = event.Records[0].s3.object.key;
   var filename = key.substring(13);

   s3.getObject({Bucket:bucket, Key:key},
      function(err,data) {
        if (err) {
           console.log('error getting object ' + key + ' from bucket ' + bucket +
               '. Make sure they exist and your bucket is in the same region as this function.');
           context.done('error','error getting file'+err);
        }
        else {
        //   console.log('CONTENT TYPE:',data.ContentType);
            var textChunk = data.Body.toString();
           // console.log('DATA:', textChunk);


          // --------------
          // Generate TFIDF

          TfIdf = natural.TfIdf,
          tfidf = new TfIdf();


          // test data
          tfidf.addDocument('Larger and Faster Elastic Block Store (EBS) Volumes.As Werner just announced from the stage at AWS re:Invent, we have some great news for users of Amazon Elastic Block Store (EBS). We are planning to support EBS volumes that are larger and faster than ever before! Here are the new specs:General Purpose (SSD) - You will be able to create volumes that store up to 16 TB and provide up to 10,000 baseline IOPS (up from 1 TB and 3,000 baseline IOPS). Volumes of this type will continue to support bursting to even higher performance levels (see my post on New SSD-Backed Elastic Block Storage for more information).Provisioned IOPS (SSD) - You will be able to create volumes that store up to 16 TB and provide up to 20,000 Provisioned IOPS (up from 1 TB and 4,000 Provisioned IOPS).');
          tfidf.addDocument('New Compute-Optimized EC2 Instances.Our customers continue to increase the sophistication and intensity of the compute-bound workloads that they run on the Cloud. Applications such as top-end website hosting, online gaming, simulation, risk analysis, and rendering are voracious consumers of CPU cycles and can almost always benefit from the parallelism offered by today multicore processors.Today we are pre-announcing the latest generation of compute-optimized Amazon Elastic Compute Cloud (EC2) instances. The new C4 instances are based on the Intel Xeon E5-2666 v3 (code name Haswell) processor. This custom processor, designed specifically for EC2, runs at a base speed of 2.9 GHz, and can achieve clock speeds as high as 3.5 GHz with Turbo boost. These instances are designed to deliver the highest level of processor performance on EC2. If youve got the workload, weve got the instance!');
          tfidf.addDocument('New Event Notifications for Amazon S3.Today we are launching a new event notification feature for S3. The bucket owner (or others, as permitted by an IAM policy) can now arrange for notifications to be issued to Amazon Simple Queue Service (SQS) or Amazon Simple Notification Service (SNS) when a new object is added to the bucket or an existing object is overwritten. Notifications can also be delivered to AWS Lambda for processing by a Lambda function. Here the general flow: For use cases that require strong consistency on S3, it is a good practice to use versioning when you are overwriting objects. With versioning enabled for a bucket, the event notification will include the version ID. Your event handle can use the ID to fetch the latest version of the object. The notification also includes the ETag of the new object. Your code can Get the object and verify the ETag before processing. If the ETags do not match, you can defer processing by posting the message back to the SNS or SQS target. Note that eventual consistency is a concern only if your application allows existing objects to be overwritten.');
          tfidf.addDocument('AWS Lambda - Run Code in the Cloud.Lambda is a zero-administration compute platform. You dont have to configure, launch, or monitor EC2 instances. You don have to install any operating systems or language environments. You dont need to think about scale or fault tolerance and you dont need to request or reserve capacity. A freshly created function is ready and able to handle tens of thousands of requests per hour with absolutely no incremental effort on your part, and on a very cost-effective basis.You upload your code and then specify context information to AWS Lambda to create a function. The context information specifies the execution environment (language, memory requirements, a timeout period, and IAM role) and also points to the function youd like to invoke within your code. The code and the metadata are durably stored in AWS and can later be referred to by name or by ARN (Amazon Resource Name). You an also include any necessary third-party libraries in the upload (which takes the form of a single ZIP file per function).');
          tfidf.addDocument(textChunk);

          console.log('++++ Document ++++: ', key);
          var scores = [];
          for (var i = 0; i < TOP_N; i++) {
            item = tfidf.listTerms(4 /*document index*/)[i];
            // tfidf.listTerms(4 /*document index*/).forEach(function(item) {
              score = item.term + ':' + item.tfidf;
              console.log(score);
              scores.push(score);
            // });
          };

          // TFIDF --------------

           // ---- DynamoDB operations
           console.log('Putting doc into DynamoDB..');
            ddb.putItem(
            {
               "TableName":"Documents",
                "Item":{
                  "filename":{"S":filename},
                  "path":{"S":inputDir},
                  "score":{"S":scores.join(",")},
                  "text":{"S":textChunk}
                }
            }, function(err, data) {
              if (err) {
                console.log('ERROR', err);
              }
              else {
                console.log('DDB saved: ', filename);
                 context.done(null,'');
              };
            });

           // ---- DDB


        }
      }
   );
    // s3 getObjects
};
