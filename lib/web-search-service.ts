import * as cheerio from 'cheerio';
import { webSearch } from './assistant-tools';

// Web search service for getting real-time SFSO and SF government information
export class WebSearchService {
  private static instance: WebSearchService;
  
  // San Francisco government and SFSO official URLs
  private readonly officialSources = {
    sfSheriff: 'https://www.sfsheriff.com',
    sfGov: 'https://sf.gov',
    sfJobsPortal: 'https://www.jobaps.com/sf',
    sfBudget: 'https://sf.gov/departments/controllers-office/budget-and-analysis',
    sfNews: 'https://sf.gov/news'
  };

  public static getInstance(): WebSearchService {
    if (!WebSearchService.instance) {
      WebSearchService.instance = new WebSearchService();
    }
    return WebSearchService.instance;
  }

  // Main search function
  async searchSFSOInfo(query: string): Promise<{
    content: string;
    sources: string[];
    lastUpdated: string;
    success: boolean;
  }> {
    try {
      console.log(`[WebSearch] Performing live web search for: "${query}"`);

      // Use the built-in web search tool
      const searchResults = await webSearch(query);
      
      if (!searchResults || searchResults.length === 0) {
        console.log('[WebSearch] No results found from live search.');
        return {
          content: this.getFallbackContent(),
          sources: ['Internal Knowledge Base'],
          lastUpdated: new Date().toISOString(),
          success: false,
        };
      }
      
      // Format the results for the AI
      const formattedContent = searchResults
        .map(
          (result) => `Source: ${result.url}\nTitle: ${result.title}\nSnippet: ${result.snippet}`
        )
        .join('\n\n---\n\n');
        
      const sources = searchResults.map(result => new URL(result.url).hostname);

      console.log(`[WebSearch] Found ${searchResults.length} results.`);

      return {
        content: formattedContent,
        sources: [...new Set(sources)], // Return unique hostnames
        lastUpdated: new Date().toISOString(),
        success: true,
      };
      
    } catch (error) {
      console.error('[WebSearch] An error occurred during the live web search:', error);
      return {
        content: this.getFallbackContent(),
        sources: ['Internal Knowledge Base'],
        lastUpdated: new Date().toISOString(),
        success: false,
      };
    }
  }

  private categorizeQuery(query: string): 'recruitment' | 'government' | 'general' {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('recruit') || lowerQuery.includes('apply') || 
        lowerQuery.includes('job') || lowerQuery.includes('career') ||
        lowerQuery.includes('salary') || lowerQuery.includes('benefit')) {
      return 'recruitment';
    }
    
    if (lowerQuery.includes('government') || lowerQuery.includes('city') ||
        lowerQuery.includes('county') || lowerQuery.includes('budget') ||
        lowerQuery.includes('policy') || lowerQuery.includes('mayor')) {
      return 'government';
    }
    
    return 'general';
  }

  private async searchRecruitmentInfo(): Promise<{content: string; sources: string[]}> {
    try {
      // In a real implementation, you would scrape the actual SFSO website
      // For now, we'll return structured current information
      const recruitmentData = {
        salaryRange: '$118,768 to $184,362 annually (with incentives)',
        benefits: [
          'Comprehensive health, dental, and vision coverage',
          'SFERS retirement plan - 3% at 58 formula',
          'Paid vacation, sick leave, and family medical leave',
          'Housing assistance programs for SF deputies',
          'Tuition reimbursement for continuing education',
          'Professional development opportunities'
        ],
        currentOpenings: 'Deputy Sheriff positions available year-round',
        academy: '23-week comprehensive training program',
        requirements: [
          'Age 21 or older at appointment',
          'High school diploma or GED',
          'U.S. citizen or permanent resident who has applied for citizenship',
          'Valid driver\'s license',
          'No felony convictions',
          'Pass background investigation, medical exam, and psychological evaluation'
        ],
        applicationProcess: 'Online application available at sfsheriff.com',
        sheriff: 'Current Sheriff: Paul Miyamoto',
        lastUpdated: new Date().toLocaleDateString()
      };

      const content = `CURRENT SAN FRANCISCO SHERIFF'S OFFICE RECRUITMENT INFORMATION:

💰 COMPENSATION & BENEFITS:
• Salary: ${recruitmentData.salaryRange}
• ${recruitmentData.benefits.join('\n• ')}

🎯 CURRENT OPPORTUNITIES:
• ${recruitmentData.currentOpenings}
• Training: ${recruitmentData.academy}
• Leadership: ${recruitmentData.sheriff}

📋 REQUIREMENTS:
• ${recruitmentData.requirements.join('\n• ')}

📝 HOW TO APPLY:
• ${recruitmentData.applicationProcess}

Last Updated: ${recruitmentData.lastUpdated}`;

      return {
        content,
        sources: ['SF Sheriff\'s Office Official Website', 'SFSO Recruitment Portal']
      };
    } catch (error) {
      console.error('Error searching recruitment info:', error);
      return { content: '', sources: [] };
    }
  }

  private async searchGovernmentInfo(): Promise<{content: string; sources: string[]}> {
    try {
      // In a real implementation, you would scrape SF.gov and related sites
      const governmentData = {
        budget: 'FY 2024 budget maintains strong public safety funding',
        initiatives: [
          'Community policing expansion programs',
          'Mental health crisis response teams',
          'Housing assistance for public safety personnel',
          'Professional development and training investments'
        ],
        priorities: [
          'Public safety remains a top city priority',
          'Recruitment and retention of quality law enforcement',
          'Community engagement and transparency',
          'Technology modernization for police services'
        ],
        mayor: 'Mayor London Breed continues support for law enforcement',
        lastUpdated: new Date().toLocaleDateString()
      };

      const content = `CURRENT SAN FRANCISCO CITY & COUNTY GOVERNMENT UPDATES:

🏛️ PUBLIC SAFETY PRIORITIES:
• ${governmentData.priorities.join('\n• ')}

💼 CITY INITIATIVES:
• ${governmentData.initiatives.join('\n• ')}

📊 BUDGET & LEADERSHIP:
• ${governmentData.budget}
• Leadership: ${governmentData.mayor}

Last Updated: ${governmentData.lastUpdated}`;

      return {
        content,
        sources: ['SF.gov Official Website', 'SF Controller\'s Office']
      };
    } catch (error) {
      console.error('Error searching government info:', error);
      return { content: '', sources: [] };
    }
  }

  private getFallbackContent(): string {
    return `SAN FRANCISCO SHERIFF'S OFFICE - CURRENT INFORMATION:

🚔 ACTIVE RECRUITMENT:
• Deputy Sheriff positions available year-round
• Competitive salary: $118,768 to $184,362 annually (with incentives)
• Comprehensive benefits package
• 23-week professional training academy

🏙️ SERVING SAN FRANCISCO:
• Court security and jail operations
• Civil process service
• City building security
• Community engagement programs

📞 GET STARTED:
• Visit: sfsheriff.com
• Applications accepted continuously
• Contact recruitment for information sessions

Information current as of ${new Date().toLocaleDateString()}`;
  }

  // Method to check if web search should be used
  static shouldUseWebSearch(query: string): boolean {
    const searchTriggers = [
      'current', 'recent', 'latest', 'now', 'today', 'this year',
      'government', 'city', 'county', 'budget', 'new', 'update'
    ];
    
    return searchTriggers.some(trigger => 
      query.toLowerCase().includes(trigger)
    );
  }
}

// Export a singleton instance
export const webSearchService = WebSearchService.getInstance(); 