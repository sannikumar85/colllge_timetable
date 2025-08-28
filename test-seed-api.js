// Test script for the seed API
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Sample college data for testing
const testCollege = {
  collegeId: 'TEST001',
  name: 'Test Engineering College',
  email: 'test@college.edu',
  phone: '1234567890'
};

async function testSeedAPI() {
  try {
    console.log('🧪 Testing Seed API...\n');
    
    // Test 1: Check initial status
    console.log('📊 Step 1: Checking initial database status...');
    try {
      const statusResponse = await axios.get(`${BASE_URL}/seed/status/${testCollege.collegeId}`);
      console.log('✅ Current Status:', statusResponse.data.data);
    } catch (error) {
      console.log('ℹ️  No existing data found (this is normal for first run)');
    }
    
    // Test 2: Seed all data
    console.log('\n🌱 Step 2: Seeding all sample data...');
    const seedResponse = await axios.post(`${BASE_URL}/seed/all`, {
      collegeId: testCollege.collegeId
    });
    
    console.log('✅ Seed Response:', seedResponse.data);
    console.log(`📊 Added: ${seedResponse.data.data.branches} branches, ${seedResponse.data.data.teachers} teachers, ${seedResponse.data.data.subjects} subjects`);
    
    // Test 3: Verify status after seeding
    console.log('\n📊 Step 3: Verifying database status after seeding...');
    const finalStatusResponse = await axios.get(`${BASE_URL}/seed/status/${testCollege.collegeId}`);
    console.log('✅ Final Status:', finalStatusResponse.data.data);
    
    // Test 4: Get sample data
    console.log('\n📋 Step 4: Fetching sample data to verify...');
    
    try {
      const branchesResponse = await axios.get(`${BASE_URL}/branches/${testCollege.collegeId}`);
      console.log(`✅ Branches fetched: ${branchesResponse.data.length}`);
      console.log('Sample branches:', branchesResponse.data.slice(0, 3).map(b => b.name));
    } catch (error) {
      console.log('❌ Error fetching branches:', error.message);
    }
    
    try {
      const teachersResponse = await axios.get(`${BASE_URL}/teachers/${testCollege.collegeId}`);
      console.log(`✅ Teachers fetched: ${teachersResponse.data.length}`);
      console.log('Sample teachers:', teachersResponse.data.slice(0, 3).map(t => `${t.name} (${t.qualification})`));
    } catch (error) {
      console.log('❌ Error fetching teachers:', error.message);
    }
    
    try {
      const subjectsResponse = await axios.get(`${BASE_URL}/subjects/${testCollege.collegeId}`);
      console.log(`✅ Subjects fetched: ${subjectsResponse.data.length}`);
      console.log('Sample subjects:', subjectsResponse.data.slice(0, 3).map(s => `${s.name} (${s.type})`));
    } catch (error) {
      console.log('❌ Error fetching subjects:', error.message);
    }
    
    console.log('\n🎉 Seed API test completed successfully!');
    console.log('🌐 You can now visit http://localhost:3000 to see the seeded data in action.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testSeedAPI();
