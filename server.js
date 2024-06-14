const express = require('express');
const stripe = require('stripe')('sk_test_51PRBatP03WaeIhLtO3PgwAlIydVu8LlKt41riASDtUcVssfgiAse2ts6GCzmIDtLgBULTR6TYgYa0dg1xsXME2oa004BhwXV6I');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = 3000;

const supabaseUrl = 'https://okvrfrsprszodmcciylg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rdnJmcnNwcnN6b2RtY2NpeWxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTczMjA1NTIsImV4cCI6MjAzMjg5NjU1Mn0.RgMQoYWI7hTZDfq8TkhF573PUOZi5J0PjrUGN2oDWXA'; // Replace this with your actual Supabase API key
const supabase = createClient(supabaseUrl, supabaseKey);



app.use(bodyParser.json());
app.use(cors());

app.post('/create-payment-intent', async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

const generateShortOrderId = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

app.post('/save-order', async (req, res) => {
  const { userId, fashionItemId, price, size } = req.body;

  try {
    const { data: photoData, error: photoError } = await supabase
      .from('fashion_item_photos')
      .select('url')
      .eq('fashion_item_id', fashionItemId)
      .single();

    if (photoError) {
      console.error('Supabase error fetching photo:', photoError);
      throw photoError;
    }

    const imageUrl = photoData ? photoData.url : null;

    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          user_id: userId, 
          item_id: fashionItemId, 
          price: price, 
          size: size,
          image: imageUrl,
          order_id: generateShortOrderId(),
          created_at: new Date(),
          orderstatus: 'In verwerking' 
        }
      ])
      .select();

    console.log('Supabase data:', data);
    console.log('Supabase error:', error);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No data returned from Supabase');
    }

    res.status(200).json({ message: 'Order saved successfully', orderId: data[0].id });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Failed to save order' });
  }
});

app.post('/remove-favorite', async (req, res) => {
  const { userId, fashionItemId } = req.body;

  try {
    const { data, error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('item_id', fashionItemId);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.status(200).json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
