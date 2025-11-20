// src/app/about/page.tsx
export default function AboutPage() {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Ikaze</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Welcome to Ikaze - your gateway to authentic Rwandan stories and experiences.
          </p>
        </div>
  
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Our Story */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Ikaze, which means "Welcome" in Kinyarwanda, was born from a passion for sharing 
              the Rich culture, vibrant lifestyle, and untold stories of Rwanda. We believe 
              every story matters and every voice deserves to be heard.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our platform connects writers, travelers, food enthusiasts, and culture lovers 
              who want to explore and share the beauty of Rwanda through authentic narratives.
            </p>
          </div>
  
          {/* What We Offer */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">What We Offer</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-gray-600">Authentic stories about Rwandan culture and lifestyle</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-gray-600">Platform for writers to share their experiences</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-gray-600">Community engagement through comments and likes</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <p className="text-gray-600">Discover hidden gems and local insights</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Mission & Vision */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To create a vibrant community where Rwandan stories are celebrated, shared, 
                and preserved for future generations. We aim to be the most trusted platform 
                for authentic narratives about life in Rwanda.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                A world where every Rwandan story finds its audience, and where people 
                everywhere can discover the true beauty and diversity of Rwandan culture 
                through the eyes of those who live it.
              </p>
            </div>
          </div>
        </div>
  
        {/* Join Community */}
        <div className="text-center bg-green-50 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you're a writer, reader, or simply curious about Rwanda, there's a place for you here. 
            Share your stories, connect with others, and be part of something meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Get Started
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Explore Stories
            </a>
          </div>
        </div>
      </div>
    );
  }